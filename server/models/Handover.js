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
    userAlias: {
      type: String,
      required: true
    },
    entryDate: {
      type: Number,
      rangeKey: true
    },
    handingOverTeam: {
      type: String,
      required: true
    },
    handedOverTeam: {
      type: String,
      required: true
    },
    items: {
      type: "list",
      list: [
        {
          status: String,
          link: String,
          description: String
        }
      ]
    }
  },
  {
    throughput,
    timestamps: { createdAt: "entryDate", updatedAt: "updated_at" }
  }
);

const Handover = db.model("Handover", handoverSchema);
module.exports = Handover;
