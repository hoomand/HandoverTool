const express = require("express");
const Handover = require("../../models/Handover");
const passport = require("passport");

const router = express.Router();

// @route   GET api/handovers
// @desc    Tests Handovers route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "handovers work!" }));

module.exports = router;
