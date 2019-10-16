const db = require("../db");
const Schema = db.Schema;

const throughput = require("../config/dynamo").throughput;
const teamSchema = new Schema(
  {
    name: {
      type: String,
      hashKey: true
    },
    created_by_alias: {
      type: "String",
      required: true
    }
  },
  {
    throughput,
    timestamps: { createdAt: "entryDate", updatedAt: "updated_at" }
  }
);

const Team = db.model("Team", teamSchema);
module.exports = Team;
