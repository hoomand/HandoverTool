const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const Team = require("../../models/Team");
const loginUser = require("../utils");
const randomText = require("../../utils");

describe("POST /api/teams", () => {
  beforeAll(() => {
    const newUser = new User({
      alias: "bijan",
      password: "$2a$10$XwnrAPIH1jzK7PITSqeckesK3O6VhjstdPPOyArCyCkzbCrtPP/mG"
    });
    newUser.save();

    // const newTeam = new Team({
    //   name: "Sydney Reds",
    //   created_by_alias: "bijan"
    // });
    // newTeam.save();
  });

  afterAll(() => {
    User.batchDelete([{ alias: "bijan" }], err => {
      if (err) {
        console.log("Couldn't flush the Users test database");
        console.log(err);
        return;
      }
    });
    Team.batchDelete(
      [{ name: "Seattle Blues" }, { name: "Sydney Reds" }],
      err => {
        if (err) {
          console.log("Couldn't flush the Teams test database");
          console.log(err);
          return;
        }
      }
    );
  });

  test("It should fail to create new team without authentication token", async () => {
    const response = await request(app)
      .post("/api/teams")
      .send({
        name: "Seattle Blues",
        created_by_alias: "bijan"
      });

    expect(response.text).toEqual("Unauthorized");
    expect(response.statusCode).toBe(401);
  });

  test("It should fail creating a new team without team name", async () => {
    const token = await loginUser("bijan", "oohoomhoom");

    const response = await request(app)
      .post("/api/teams")
      .send({})
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      });

    expect(response.body).toEqual({
      name: "Team name must be between 3 and 30 characters"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail creating a new team with a name less than 3 characters long", async () => {
    const token = await loginUser("bijan", "oohoomhoom");

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
    const token = await loginUser("bijan", "oohoomhoom");

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

  test("It should successfully create a new team", async () => {
    const token = await loginUser("bijan", "oohoomhoom");

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
      created_by_alias: "bijan"
    });
    expect(response.statusCode).toBe(200);
  });
});
