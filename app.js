const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

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

//============================================================//
/* PRODUCTION CONFIG */
//============================================================//
if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  app.use(express.static("client/build"));

  // Express will serve up the front-end index.html file if it doesn't recognize the route
  app.get("*", (req, res) =>
    res.sendFile(path.resolve("client", "build", "index.html"))
  );
}

module.exports = app;
