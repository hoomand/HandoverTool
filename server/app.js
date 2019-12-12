const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const teams = require("./routes/api/teams");
const handovers = require("./routes/api/handovers");
const configs = require("./routes/api/configs");
const app = express();

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/teams", teams);
app.use("/api/handovers", handovers);

app.use("/api/configs", configs);

module.exports = app;
