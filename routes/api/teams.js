const express = require("express");
const Team = require("../../models/Team");
const passport = require("passport");

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
    //   const { errors, isValid } = validatePostInput(req.body);

    //   if (!isValid) {
    //     return res.status(400).json(errors);
    //   }
    const newTeam = new Team({
      name: req.body.name,
      created_by_alias: req.user.alias
    });
    newTeam.save().then(team => res.json(team));
  }
);

module.exports = router;
