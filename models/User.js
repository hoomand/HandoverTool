const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

const throughput = require("../config/dynamo").throughput;
const userSchema = new Schema(
  {
    alias: {
      type: "String",
      hashKey: true
    },
    email: {
      type: String
    },
    creationDate: {
      type: Date
    }
  },
  {
    throughput
  }
);

module.exports = User = dynamoose.model("User", userSchema);
