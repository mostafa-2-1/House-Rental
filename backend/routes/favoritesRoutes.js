const express = require('express');
const router = express.Router();
const db = require('../db'); 
const Joi = require('joi');

router.post('/add', (req, res) => {
  const { memberId, propertyId } = req.body;

  const { error } = Joi.object({
    memberId: Joi.number().required(),
    propertyId: Joi.number().required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  db.query(
    'SELECT * FROM Favorites WHERE memberId = ? AND propertyId = ?',
    [memberId, propertyId],
    (err, result) => {
      if (err) {
        console.error('Error checking if favorite exists:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'Property is already in favorites' });
      }

      db.query(
        'INSERT INTO Favorites (memberId, propertyId) VALUES (?, ?)',
        [memberId, propertyId],
        (err, insertResult) => {
          if (err) {
            console.error('Error adding to favorites:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          res.status(201).json({ success: true, message: 'Property added to favorites' });
        }
      );
    }
  );
});

router.get('/list/:memberId', async (req, res) => {
  console.log('Fetching favorite properties for member.');

  const { memberId } = req.params;

  if (!memberId) {
    return res.status(400).json({ message: 'Member ID is required' });
  }

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
    const query = `
      SELECT 
        p.propertyId, 
        p.price, 
        p.type, 
        p.capacity, 
        p.bedrooms, 
        p.bathrooms, 
        l.city,
        GROUP_CONCAT(ai.imag) AS images
      FROM Property p
      JOIN Favorites f ON p.propertyId = f.propertyId
      INNER JOIN Location l ON p.locationId = l.locationId
      LEFT JOIN Apartment_Image ai ON p.propertyId = ai.propertyId
      WHERE f.memberId = ?
      GROUP BY p.propertyId
    `;

    const fetchResult = await queryAsync(query, [memberId]);

    if (!fetchResult || fetchResult.length === 0) {
      console.log('No favorites found for this member.');
      return res.status(404).json({ message: 'No favorites found' });
    }

    const properties = fetchResult.map(row => ({
      propertyId: row.propertyId,
      price: row.price,
      type: row.type,
      capacity: row.capacity,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      city: row.city,
      images: row.images ? row.images.split(',') : [] 
    }));

    res.status(200).json({ success: true, favorites: properties });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({
      message: 'Unexpected error.',
      error: err.message,
    });
  }
});




router.delete('/remove', (req, res) => {
  const { memberId, propertyId } = req.body;

  const { error } = Joi.object({
    memberId: Joi.number().required(),
    propertyId: Joi.number().required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  db.query(
    'DELETE FROM Favorites WHERE memberId = ? AND propertyId = ?',
    [memberId, propertyId],
    (err, result) => {
      if (err) {
        console.error('Error removing from favorites:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Favorite not found' });
      }

      res.status(200).json({ success: true, message: 'Property removed from favorites' });
    }
  );
});
router.get('/get', (req, res) => {

  db.query(
    `SELECT p.* FROM Property p
     JOIN Favorites f ON p.propertyId = f.propertyId`,
    (err, result) => {
      if (err) {
        console.error('Error fetching favorites:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.status(200).json({ success: true, favorites: result });
    }
  );
});


module.exports = router;
