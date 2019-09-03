const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const Team = require("../../models/Team");
const { createUser, loginUser } = require("../utils");
const randomText = require("../../utils");

let test_user1 = {
  alias: "team_test_user",
  password: randomText(10),
  token: ""
};

describe("POST /api/teams", () => {
  beforeAll(async () => {
    const { alias, password } = test_user1;
    await createUser(alias, password);
    test_user1.token = await loginUser(alias, password);

    const newTeam = new Team({
      name: "Sydney Reds",
      created_by_alias: alias
    });
    await newTeam.save();
  });

  afterAll(async () => {
    await User.batchDelete([{ alias: test_user1.alias }]);
    await Team.batchDelete([
      { name: "Seattle Blues" },
      { name: "Sydney Reds" }
    ]);
  });

  test("It should fail to create new team without authentication token", async () => {
    const response = await request(app)
      .post("/api/teams")
      .send({
        name: "Seattle Blues",
        created_by_alias: test_user1.alias
      });

    expect(response.text).toEqual("Unauthorized");
    expect(response.statusCode).toBe(401);
  });

  test("It should fail creating a new team without team name", async () => {
    const response = await request(app)
      .post("/api/teams")
      .send({})
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: test_user1.token
      });

    expect(response.body).toEqual({
      name: "Team name must be between 3 and 30 characters"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail creating a new team with a name less than 3 characters long", async () => {
    const { token } = test_user1;

    const response = await request(app)
      .post("/api/teams")
      .send({ name: "ff" })
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      });

    expect(response.body).toEqual({
      name: "Team name must be between 3 and 30 characters"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail creating a new team with a name greater than 30 characters long", async () => {
    const { token } = test_user1;

    const response = await request(app)
      .post("/api/teams")
      .send({ name: randomText(31) })
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      });

    expect(response.body).toEqual({
      name: "Team name must be between 3 and 30 characters"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail creating a new team with a name that already exists", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/teams")
      .send({
        name: "Sydney Reds"
      })
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      });

    const duplicateResponse = await request(app)
      .post("/api/teams")
      .send({ name: "Sydney Reds" })
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      });

    expect(duplicateResponse.statusCode).toBe(400);
    expect(duplicateResponse.body).toEqual({
      name: "team already exists"
    });
  });

  test("It should successfully create a new team", async () => {
    const { token } = test_user1;

    const response = await request(app)
      .post("/api/teams")
      .send({
        name: "Seattle Blues"
      })
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      });

    expect(response.body).toEqual({
      name: "Seattle Blues",
      created_by_alias: test_user1.alias
    });
    expect(response.statusCode).toBe(200);
  });
});
