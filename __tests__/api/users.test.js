const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const appConfigs = require("../../config/app");
const randomText = require("../../utils");

describe("POST /api/users/register", () => {
  afterEach(async () => {
    // Flush the User table of test items
    // Dynamoose does not have a table delete or flush functionality (http://bit.ly/30LSptj),
    // consequently we have to delete every single record we insert in db in here
    // Todo: Try deleteTable module: https://stackoverflow.com/questions/48674431/how-to-delete-a-table-using-dynamoose
    await User.batchDelete(
      [{ alias: "me@myself.com" }, { alias: "faeze" }],
      err => {
        if (err) {
          console.log("Couldn't flush the test database");
          console.log(err);
          return;
        }
      }
    );
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

  test("It should fail to register an alias that already exists", async () => {
    appConfigs.aliasIsEmail = false;

    await request(app)
      .post("/api/users/register")
      .send({ alias: "faeze", password: "something_random" });

    const repeatedRequestReponse = await request(app)
      .post("/api/users/register")
      .send({ alias: "faeze", password: "something_random" });

    expect(repeatedRequestReponse.statusCode).toBe(400);
    expect(repeatedRequestReponse.body).toEqual({
      alias: "alias already exists"
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

describe("POST /api/users/login", () => {
  beforeAll(() => {
    const newUser = new User({
      alias: "bijan",
      password: "$2a$10$XwnrAPIH1jzK7PITSqeckesK3O6VhjstdPPOyArCyCkzbCrtPP/mG"
    });
    newUser.save();
  });

  afterAll(() => {
    User.batchDelete([{ alias: "bijan" }], err => {
      if (err) {
        console.log("Couldn't flush the test database");
        console.log(err);
        return;
      }
    });
  });

  test("It should fail if no alias specified", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ password: "somePassword" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      alias: "Alias field is required"
    });
  });

  test("It should fail if no password specified", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias: "joosh" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      password: "Password field is required"
    });
  });

  test("It should fail to login for an invalid alias", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias: "someInValidUser", password: "somePassword" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      alias: "Alias not found"
    });
  });

  test("It should fail to login for a wrong password", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias: "bijan", password: "badPassword" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      password: "Password incorrect"
    });
  });

  test("It should successfully login with a valid user/password", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias: "bijan", password: "oohoomhoom" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
  });
});
