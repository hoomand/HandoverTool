const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const appConfigs = require("../../config/app");
const { createUser, loginUser } = require("../utils");
const randomText = require("../../utils");

const test_user1 = {
  alias: "users_test_user",
  password: randomText(10)
};

const test_user2 = {
  alias: "users_test_user2",
  password: randomText(10)
};

beforeAll(async () => {
  const { alias, password } = test_user1;
  await createUser(alias, password);
  await createUser(test_user2.alias, test_user2.password);
});

afterAll(async () => {
  await User.batchDelete([
    { alias: test_user1.alias },
    { alias: test_user2.alias }
  ]);
});

describe("GET /api/users", () => {
  test("It should get all existing users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.body).toHaveProperty("users");
    expect(response.body.users).toContain("users_test_user");
    expect(response.body.users).toContain("users_test_user2");
    expect(response.statusCode).toBe(200);
  });

  test("It should get the requested user", async () => {
    const response = await request(app).get("/api/users/users_test_user2");
    expect(response.body).toEqual({
      users: ["users_test_user2"]
    });
    expect(response.statusCode).toBe(200);
  });
});

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
    expect(response.body).toEqual({
      alias: "Alias must be between 3 and 30 characters",
      password: "Password must be between 8 to 50 characters long"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail to register an alias that already exists", async () => {
    appConfigs.aliasIsEmail = false;

    const { alias, password } = test_user1;
    await request(app)
      .post("/api/users/register")
      .send({ alias, password });

    const repeatedRequestReponse = await request(app)
      .post("/api/users/register")
      .send({ alias, password });

    expect(repeatedRequestReponse.body).toEqual({
      alias: "alias already exists"
    });
    expect(repeatedRequestReponse.statusCode).toBe(400);
  });

  test("It should fail for an alias shorter than 3 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: "bb", password: "something_random" });
    expect(response.body).toEqual({
      alias: "Alias must be between 3 and 30 characters"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail for an alias longer than 30 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: randomText(31), password: "something_random" });
    expect(response.body).toEqual({
      alias: "Alias must be between 3 and 30 characters"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail for a password shorter than 8 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: "abcd", password: randomText(7) });
    expect(response.body).toEqual({
      password: "Password must be between 8 to 50 characters long"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail for a password longer than 50 characters", async () => {
    appConfigs.aliasIsEmail = false;

    const response = await request(app)
      .post("/api/users/register")
      .send({ alias: "abcd", password: randomText(51) });
    expect(response.body).toEqual({
      password: "Password must be between 8 to 50 characters long"
    });
    expect(response.statusCode).toBe(400);
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
  test("It should fail if no alias specified", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ password: "somePassword" });
    expect(response.body).toEqual({
      alias: "Alias field is required"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail if no password specified", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias: "joosh" });
    expect(response.body).toEqual({
      password: "Password field is required"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail to login for an invalid alias", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias: "someInValidUser", password: "somePassword" });

    expect(response.body).toEqual({
      alias: "Alias not found"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail to login for a wrong password", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias: test_user1.alias, password: "badPassword" });

    expect(response.body).toEqual({
      password: "Password incorrect"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should successfully login with a valid user/password", async () => {
    const { alias, password } = test_user1;
    const response = await request(app)
      .post("/api/users/login")
      .send({ alias, password });
    expect(response.body).toHaveProperty("success", true);
    expect(response.statusCode).toBe(200);
  });
});
