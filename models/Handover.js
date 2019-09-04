const db = require("../db");
const Schema = db.Schema;
var shortId = require("shortid");

const throughput = require("../config/dynamo").throughput;
const handoverSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: shortId.generate
    },
    alias: {
      type: String,
      required: true
    },
    entryDate: {
      type: Date,
      rangeKey: true
    }
  },
  { throughput }
);

module.exports = Handover = db.model("Handover", handoverSchema);
