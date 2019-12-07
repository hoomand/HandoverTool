const client = require("dynamoose");
const isEmpty = require("../validation/is-empty");

let message = "Dynamo running in ";
const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION } = process.env;

switch (process.env.NODE_ENV) {
  case "test":
    console.log(message + "test");
    client.local("http://localhost:8010");
    break;
  case "production":
    console.log(message + "production");
    if (
      isEmpty(AWS_ACCESS_KEY) ||
      isEmpty(AWS_SECRET_KEY) ||
      isEmpty(AWS_REGION)
    ) {
      console.error(
        "AWS environment variables must not be empty for production environment: AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION "
      );
      process.exit(17);
    }
    client.AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_REGION
    });
    client.setDefaults({
      create: true,
      prefix: "hot-"
    });
    break;
  case "development":
  default:
    console.log(message + "development");
    client.local("http://localhost:8000");
}

module.exports = client;
