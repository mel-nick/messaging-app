const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../dbmodels/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
require('dotenv').config();

//@route GET api/auth
//@desc test route
//@ccess public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route POST api/auth
//@desc Authentificate user and get token
//@access public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with atleast 6 charackters'
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    try {
      //see if the user exists
      let user = await User.findOne({
        email,
      });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User name or password is incorrect',
            },
          ],
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User name or password is incorrect',
            },
          ],
        });
      }
      //Return jwt
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
