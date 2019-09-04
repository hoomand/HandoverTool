const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const Team = require("../../models/Team");
const { createUser, loginUser, createTeam } = require("../utils");
const randomText = require("../../utils");

let test_user1 = {
  alias: "team_test_user",
  password: randomText(10),
  token: ""
};

let test_user2 = {
  alias: "team_test_user2",
  password: randomText(10),
  token: ""
};

const test_teams = [{ name: "test_team_1" }, { name: "test_team_2" }];

beforeAll(async () => {
  const { alias, password } = test_user1;
  await createUser(alias, password);
  test_user1.token = await loginUser(alias, password);

  const { alias: alias2, password: password2 } = test_user2;
  await createUser(alias2, password2);
  test_user2.token = await loginUser(alias2, password2);

  await createTeam(test_teams[0].name, test_user1.token);
  await createTeam(test_teams[1].name, test_user2.token);
});

afterAll(async () => {
  await User.batchDelete([
    { alias: test_user1.alias },
    { alias: test_user2.alias }
  ]);
  await Team.batchDelete([
    { name: "Seattle Blues" },
    { name: test_teams[0].name },
    { name: test_teams[1].name }
  ]);
});

describe("GET /api/teams", () => {
  test("It should return existing teams", async () => {
    const response = await request(app).get("/api/teams");

    expect(response.body).toHaveProperty("teams");
    expect(response.body.teams).toContainEqual({
      name: test_teams[0].name,
      created_by_alias: test_user1.alias
    });
    expect(response.body.teams).toContainEqual({
      name: test_teams[1].name,
      created_by_alias: test_user2.alias
    });
    expect(response.statusCode).toBe(200);
  });
  test("It should fetch a team by name", async () => {
    const response = await request(app).get(`/api/teams/${test_teams[0].name}`);

    expect(response.body).toHaveProperty("teams");
    expect(response.body.teams).toEqual([
      {
        name: test_teams[0].name,
        created_by_alias: test_user1.alias
      }
    ]);
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /api/teams", () => {
  test("It should fail to create new team without authentication token", async () => {
    const response = await request(app)
      .post("/api/teams")
      .send({
        name: test_teams[0].name
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
    const duplicateResponse = await request(app)
      .post("/api/teams")
      .send({ name: test_teams[0].name })
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
