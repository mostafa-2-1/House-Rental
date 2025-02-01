

const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.post('/add', upload.array('images[]'), async (req, res) => {
  console.log('Incoming request to add property with images:');
  
  const apartmentSchema = Joi.object({
    price: Joi.number().required(),
    type: Joi.string().required(),
    capacity: Joi.number().required(),
    bedrooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
    city: Joi.string().required(),
    ownerId: Joi.number().required(),
  });

  console.log('Request body:', req.body);

  const { error } = apartmentSchema.validate(req.body);
  if (error) {
    console.error('Validation error:', error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  const { price, type, capacity, bedrooms, bathrooms, city, ownerId } = req.body;

  const images = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];
  console.log('Uploaded files:', req.files);

  try {
    const status = 'available';

    const queryAsync = (sql, params) => {
      return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
          if (err) {
            console.error('Database query error:', err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    };

    const propertyCheckResult = await queryAsync(
      `SELECT ownerId FROM Owner WHERE memberId = ?`,
      [ownerId]
    );

    let currentOwnerId;
    if (propertyCheckResult.length > 0) {
      currentOwnerId = propertyCheckResult[0].ownerId;
    } else {
      const insertOwnerResult = await queryAsync(
        'INSERT INTO Owner (memberId) VALUES (?)',
        [ownerId]
      );
      currentOwnerId = insertOwnerResult.insertId;
    }
    const locationResult = await queryAsync(
      'SELECT locationId FROM Location WHERE LOWER(city) = LOWER(?)',
      [city]
    );

    let locationId;
    if (locationResult.length === 0) {
      const insertLocationResult = await queryAsync(
        'INSERT INTO Location (city) VALUES (?)',
        [city]
      );
      locationId = insertLocationResult.insertId;
    } else {
      locationId = locationResult[0].locationId;
    }

    const maxIdResult = await queryAsync('SELECT MAX(propertyId) AS maxId FROM Property');
    const nextPropertyId = (maxIdResult[0]?.maxId || 0) + 1;

  
    await queryAsync(
      `INSERT INTO Property (propertyId, price, type, capacity, bedrooms, bathrooms, status, ownerId, locationId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nextPropertyId, price, type, capacity, bedrooms, bathrooms, status, currentOwnerId, locationId]
    );

    if (images.length > 0) {
      const createImageTableQuery = `
        CREATE TABLE IF NOT EXISTS Apartment_Image (
          imageId INT AUTO_INCREMENT PRIMARY KEY,
          propertyId INT NOT NULL,
          imag VARCHAR(255) NOT NULL,
          FOREIGN KEY (propertyId) REFERENCES Property(propertyId) ON DELETE CASCADE
        )
      `;
      await queryAsync(createImageTableQuery);

      for (const imagePath of images) {
        await queryAsync(
          'INSERT INTO Apartment_Image (propertyId, imag) VALUES (?, ?)',
          [nextPropertyId, imagePath]
        );
      }

      console.log('Files stored in the uploads folder:', fs.readdirSync('uploads/'));
    }

    const fetchResult = await queryAsync(
      `SELECT 
        p.propertyId, 
        p.price, 
        p.type, 
        p.capacity, 
        p.bedrooms, 
        p.bathrooms, 
        l.city,
        ai.imag
      FROM Property p 
      INNER JOIN Location l ON p.locationId = l.locationId
      LEFT JOIN Apartment_Image ai ON p.propertyId = ai.propertyId`
    );

    const propertiesWithImages = fetchResult.reduce((acc, row) => {
      const property = acc.find(p => p.propertyId === row.propertyId);
      if (!property) {
        acc.push({
          propertyId: row.propertyId,
          price: row.price,
          type: row.type,
          capacity: row.capacity,
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          city: row.city,
          images: row.imag ? [row.imag] : [],
        });
      } else {
        if (row.imag) {
          property.images.push(row.imag);
        }
      }
      return acc;
    }, []);

    return res.status(201).json({
      message: 'Property added successfully!',
      apartments: propertiesWithImages,
    });
  } catch (err) {
    console.error('Unexpected error during property addition:', err.message);
    return res.status(500).json({
      message: 'Failed to add property.',
      error: err.message,
    });
  }
});





router.get('/', async (req, res) => {
  const queryAsync = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  try {
    console.log('Fetching all properties with images.');

    const { location } = req.query;
    let query = `
      SELECT 
         p.propertyId, 
         p.price, 
         p.type, 
         p.capacity, 
         p.bedrooms, 
         p.bathrooms, 
         p.ownerId,
         l.city,
         GROUP_CONCAT(ai.imag) AS images
       FROM Property p
       INNER JOIN Location l ON p.locationId = l.locationId
       LEFT JOIN Apartment_Image ai ON p.propertyId = ai.propertyId
       GROUP BY p.propertyId
    `;
    const params = [];

    if (location) {
      query += ` WHERE l.city LIKE ?`;
      params.push(`%${location}%`);
    }

    const fetchResult = await queryAsync(query, params);

    if (!fetchResult || fetchResult.length === 0) {
      console.log('No properties found in the database.');
      return res.status(404).json({
        message: 'No properties found.',
      });
    }

    console.log('RESULTSSSS: ', fetchResult)
    const properties = fetchResult.map(row => ({
      propertyId: row.propertyId,
      price: row.price,
      type: row.type,
      capacity: row.capacity,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      city: row.city,
      ownerId: row.ownerId,
      images: row.images ? row.images.split(',') : [] 
    }));

    res.status(200).json({ apartments: properties });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({
      message: 'Unexpected error.',
      error: err.message,
    });
  }
});



module.exports = router;

