const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const Team = require("../../models/Team");

const loginUser = async (alias, password) => {
  const loginResponse = await request(app)
    .post("/api/users/login")
    .send({ alias, password });

  return loginResponse.body.token;
};

describe("POST /api/teams", () => {
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
        console.log("Couldn't flush the Users test database");
        console.log(err);
        return;
      }
    });
    Team.batchDelete([{ name: "Seattle Blues" }], err => {
      if (err) {
        console.log("Couldn't flush the Teams test database");
        console.log(err);
        return;
      }
    });
  });

  test("It should successfully create a new team", async () => {
    const token = await loginUser("bijan", "oohoomhoom");

    const response = await request(app)
      .post("/api/teams")
      .send({
        name: "Seattle Blues",
        created_by_alias: "bijan"
      })
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      name: "Seattle Blues",
      created_by_alias: "bijan"
    });
  });
});
