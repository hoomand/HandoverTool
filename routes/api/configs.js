const express = require("express");
const appConfigs = require("../../config/app");
const router = express.Router();

// @route   GET api/configs/app
// @desc    Returns config/app.js configuration file JSON content
// @access  Public
router.get("/app", (req, res) => {
  res.json(appConfigs);
});

module.exports = router;
