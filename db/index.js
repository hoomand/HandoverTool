const client = require("dynamoose");
const isEmpty = require("../validation/is-empty");

const {
  NODE_ENV,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION
} = require("../config/environment");

if (isEmpty(AWS_ACCESS_KEY) || isEmpty(AWS_SECRET_KEY) || isEmpty(AWS_REGION)) {
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

console.log(`Dynamo running in ${NODE_ENV}`);
switch (NODE_ENV) {
  case "test":
    client.setDefaults({
      create: true,
      prefix: "hot-test-"
    });
    break;

  case "production":
    client.setDefaults({
      create: true,
      prefix: "hot-prod-"
    });
    break;

  case "development":
  default:
    client.setDefaults({
      create: true,
      prefix: "hot-dev-"
    });
    break;
}

module.exports = client;
