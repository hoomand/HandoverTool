const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../../validation/register");

const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "users work!" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { alias, password } = req.body;
  User.get({ alias }, (err, existingUser) => {
    if (existingUser !== undefined) {
      return res.status(400).json({ alias: "alias already exists" });
    }

    const newUser = new User({
      alias,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        // Finally saving newUser object using mongoose!
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.error(err));
      });
    });
  });
});

module.exports = router;
