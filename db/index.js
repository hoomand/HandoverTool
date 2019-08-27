const client = require("dynamoose");
let dynamoDBEndPoint = "";
switch (process.env.NODE_ENV) {
  case "test":
    dynamoDBEndPoint = "http://localhost:8010";
    break;
  case "prod":
    dynamoDBEndPoint = "http://aws.amazon.com/someURL";
  case "dev":
  default:
    dynamoDBEndPoint = "http://localhost:8000";
}
client.local(dynamoDBEndPoint);

module.exports = client;
