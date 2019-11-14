const express = require("express");
const User = require("../../models/User");
const Handover = require("../../models/Handover");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const _ = require("lodash");

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
        newUser.save().then(user => res.json(user));
      });
    });
  });
});

// @route   POST api/users/login
// @desc    Login user & returning JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { alias, password } = req.body;
  User.get({ alias }, (err, user) => {
    if (!user) {
      errors.alias = "Alias not found";
      return res.status(400).json(errors);
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // successful login
        const payload = { alias: user.alias };
        jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
          res.json({ success: true, token: `Bearer ${token}` });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

router.get("/", (req, res) => {
  User.scan().exec((err, users) => {
    const results = users.map(user =>
      _.pick(user, ["alias", "entryDate", "updated_at"])
    );
    res.json({ users: results });
  });
});

// @route   GET api/users/:alias
// @desc    Get user by alias
// @access  Public
router.get("/:alias", (req, res) => {
  User.scan({ alias: req.params.alias }).exec((err, users) => {
    const aliases = users.map(user => user.alias);
    res.json({ users: aliases.sort() });
  });
});

// @route   GET /api/users/:alias/stats
// @desc    Get user stats, number of handovers and handover items
// @access  Public
router.get("/:alias/stats", (req, res) => {
  Handover.scan({ userAlias: req.params.alias }).exec((err, handovers) => {
    let totalHandoverItems = 0;
    let totalHandoverItemsTypes = {};
    handovers.forEach(handover => {
      totalHandoverItems += handover.items.length;

      handover.items.forEach(item => {
        if (totalHandoverItemsTypes[item.status]) {
          totalHandoverItemsTypes[item.status] += 1;
        } else {
          totalHandoverItemsTypes[item.status] = 1;
        }
      });
    });
    res.json({
      totalHandoverSessions: handovers.length,
      totalHandoverItems: totalHandoverItems,
      totalHandoverItemsTypes: totalHandoverItemsTypes
    });
  });
});

module.exports = router;
