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
    Team.get({ name: handingOverTeam }, (err, sourceTeam) => {
      if (sourceTeam === undefined) {
        return res
          .status(400)
          .json({ handingOverTeam: "handing over team is not registered" });
      } else {
        Team.get({ name: handedOverTeam }, (err, targetTeam) => {
          if (targetTeam === undefined) {
            return res
              .status(400)
              .json({ handedOverTeam: "handed over team is not registered" });
          } else {
            const newHandover = new Handover({
              userAlias: req.user.alias,
              handingOverTeam,
              handedOverTeam,
              items
            });

            newHandover.save().then(handover => res.json(handover));
          }
        });
      }
    });
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
