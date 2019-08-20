const dynamoose = require("dynamoose");
// TODO: read env to decide if it's local or not
dynamoose.local("http://localhost:8000");
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
