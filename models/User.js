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
    }
  },
  {
    throughput,
    timestamps: { createdAt: "entryDate", updatedAt: "updated_at" }
  }
);

const User = db.model("User", userSchema);
module.exports = User;
