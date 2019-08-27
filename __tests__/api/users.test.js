const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const appConfigs = require("../../config/app");
const randomText = require("../../utils");

process.env.NODE_ENV = "test";
describe("POST /api/users/register", () => {
  afterEach(async () => {
    // Flush the User table of test items
    // Dynamoose does not have a table delete or flush functionality (http://bit.ly/30LSptj),
    // consequently we have to delete every single record we insert in db in here
    // Todo: Try deleteTable module: https://stackoverflow.com/questions/48674431/how-to-delete-a-table-using-dynamoose
    await User.batchDelete([{ alias: "me@myself.com" }], err => {
      if (err) {
        console.log("Couldn't flush the test database");
        console.log(err);
        return;
      }
    });
  });

  test("It should fail to register a user without any values", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app).post("/api/users/register");
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      alias: "Alias must be between 3 and 30 characters",
      password: "Password must be between 8 to 50 characters long"
    });
  });

  test("It should fail for an alias shorter than 3 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: "bb", password: "something_random" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      alias: "Alias must be between 3 and 30 characters"
    });
  });

  test("It should fail for an alias longer than 30 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: randomText(31), password: "something_random" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      alias: "Alias must be between 3 and 30 characters"
    });
  });

  test("It should fail for a password shorter than 8 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: "abcd", password: randomText(7) });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      password: "Password must be between 8 to 50 characters long"
    });
  });

  test("It should fail for a password longer than 50 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: "abcd", password: randomText(51) });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      password: "Password must be between 8 to 50 characters long"
    });
  });

  test("It should only accept an email address for alias if appConfig.aliasIsEmail is set to true", async () => {
    appConfigs.aliasIsEmail = true;

    const failedResponse = await request(app)
      .post("/api/users/register")
      .send({ alias: "abcd", password: "someValidPassword" });
    expect(failedResponse.statusCode).toBe(400);
    expect(failedResponse.body).toEqual({
      alias: "Alias must be a valid email address"
    });

    const successResponse = await request(app)
      .post("/api/users/register")
      .send({ alias: "me@myself.com", password: "someValidPassword" });
    expect(successResponse.statusCode).toBe(200);
  });
});
