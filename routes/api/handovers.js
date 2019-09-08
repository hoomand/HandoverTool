const express = require("express");
const Team = require("../../models/Team");
const Handover = require("../../models/Handover");
const passport = require("passport");
const validateTeamInput = require("../../validation/team");

const router = express.Router();

// @route   GET api/handovers
// @desc    Tests Handovers route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "handovers work!" }));

// @route   POST api/handovers
// @desc    Create new handover
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
          }
        });

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
);

module.exports = router;
