const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
router.post('/signup', (req, res) => {
  const { username, phoneNumber, email, password } = req.body;

  const { error } = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  db.query(
    `INSERT INTO User (phoneNumber, email, password, role, username) 
     VALUES (?, ?, ?, 'member', ?)`,
    [phoneNumber, email, password, username],
    (err, userResult) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(400).json({ message: 'Failed to insert user', error: err.message });
      }

      db.query('SELECT LAST_INSERT_ID() AS userId', (err, userIdResult) => {
        if (err) {
          console.error('Error fetching userId:', err);
          return res.status(400).json({ message: 'Failed to fetch userId', error: err.message });
        }

        const userId = userIdResult[0].userId;

        db.query(
          `INSERT INTO Member (memberShipType, statues, profilePicture, banDuration, preferenceId, banAdminId, userId) 
           VALUES ('basic', 'active', NULL, NULL, NULL, NULL, ?)`,
          [userId],
          (err, memberResult) => {
            if (err) {
              console.error('Error inserting member:', err);
              return res.status(400).json({ message: 'Failed to insert member', error: err.message });
            }
            const memberId = memberResult.insertId;
            db.query(
              `INSERT INTO Renter (memberId) VALUES (?)`,
              [memberResult.insertId],
              (err, renterResult) => {
                if (err) {
                  console.error('Error inserting renter:', err);
                  return res.status(400).json({ message: 'Failed to insert renter', error: err.message });
                }

                res.status(201).json({
                  success: true,
                  memberId: memberId,
                });
                
              }
            );
          }
        );
      });
    }
  );
});


router.post('/signin', (req, res) => {
 
  const { email, password } = req.body;

  const { error } = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).validate(req.body);
  
  if (error) {
    const errorMessage = error.details && error.details.length > 0
      ? error.details[0].message
      : "Unknown error during validation.";
    return res.status(400).json({ message: errorMessage });
  }
  db.query('SELECT * FROM User WHERE email = ?', [email], (err, userResult) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (userResult.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult[0];

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    db.query('SELECT * FROM Member WHERE userId = ?', [user.UserId], (err, memberResult) => {
      if (err) {
        console.error('Error fetching member:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (memberResult.length === 0) {
        return res.status(401).json({ message: 'No member found for this user' });
      }

      const memberId = memberResult[0].memberId; 

      res.status(200).json({
        success: true,
        message: 'Login successful',
        memberId: memberId, 
      });
    });
  });
});


module.exports = router;

