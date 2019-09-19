const express = require("express");
const Team = require("../../models/Team");
const Handover = require("../../models/Handover");
const passport = require("passport");
const validateHandoverInput = require("../../validation/handover");

const router = express.Router();

// @route   POST api/handovers
// @desc    Create new handover
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateHandoverInput(req.body, req.user);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { handingOverTeam, handedOverTeam, items } = req.body;
    const newHandover = new Handover({
      userAlias: req.user.alias,
      handingOverTeam,
      handedOverTeam,
      items
    });

    newHandover.save().then(handover => res.json(handover));
  }
);

// @route   GET api/handovers
// @desc    Get all the handovers
// @access  Public
router.get("/", (req, res) => {
  Handover.scan().exec((err, handovers) => {
    res.json({ handovers });
  });
});

module.exports = router;
