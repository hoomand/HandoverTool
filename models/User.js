const db = require("../db");
const Schema = db.Schema;

const throughput = require("../config/dynamo").throughput;
const userSchema = new Schema(
  {
    alias: {
      type: "String",
      hashKey: true
    },
    password: {
      type: String,
      required: true
    },
    creationDate: {
      type: Date
    }
  },
  {
    throughput
  }
);

module.exports = User = db.model("User", userSchema);
