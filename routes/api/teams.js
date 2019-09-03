const express = require("express");
const Team = require("../../models/Team");
const passport = require("passport");
const validateTeamInput = require("../../validation/team");

const router = express.Router();

// @route   GET api/teams/test
// @desc    Tests Teams route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "teams work!" }));

// @route   POST api/teams
// @desc    Create new team
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTeamInput(req.body, req.user);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { name } = req.body;
    Team.get({ name }, (err, existingTeam) => {
      if (existingTeam !== undefined) {
        return res.status(400).json({ name: "team already exists" });
      }
      const newTeam = new Team({
        name: req.body.name,
        created_by_alias: req.user.alias
      });
      newTeam.save().then(team => res.json(team));
    });
  }
);

// @route   GET api/teams
// @desc    Get all teams
// @access  Public
router.get("/", (req, res) => {
  Team.scan().exec((err, teams) => {
    res.json({ teams });
  });
});

// @route   GET api/teams/:name
// @desc    Get team by name
// @access  Public
router.get("/:name", (req, res) => {
  Team.scan({ name: req.params.name }).exec((err, teams) => {
    res.json({ teams });
  });
});

module.exports = router;
