const express = require("express");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);

module.exports = app;
