const express = require("express");
const User = require("../../models/User");
const isEmpty = require("../../validation/is-empty");

const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "users work!" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { alias, email } = req.body;
  console.log(`alias is: ${alias}`);

  User.get({ alias }, (err, existingUser) => {
    if (!isEmpty(err)) {
      return res.status(500).json({ database: "error in database operation" });
    }
    if (existingUser !== undefined) {
      return res.status(400).json({ alias: "alias already exists" });
    }

    const newUser = new User({
      alias,
      email
    });
    newUser.save().then(user => res.json(user));
  });
});

module.exports = router;
