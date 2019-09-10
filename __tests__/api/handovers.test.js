const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const Team = require("../../models/Team");
const Handover = require("../../models/Handover");
const { createUser, loginUser, createTeam } = require("../utils");
const randomText = require("../../utils");

let test_user1 = {
  alias: "handover_test_user",
  password: randomText(10),
  token: ""
};

const test_teams = [{ name: "handover_team_1" }, { name: "handover_team_2" }];

beforeAll(async () => {
  const { alias, password } = test_user1;
  await createUser(alias, password);
  test_user1.token = await loginUser(alias, password);

  await createTeam(test_teams[0].name, test_user1.token);
  await createTeam(test_teams[1].name, test_user1.token);
});

afterAll(async () => {
  await User.batchDelete([{ alias: test_user1.alias }]);
  await Team.batchDelete([
    { name: test_teams[0].name },
    { name: test_teams[1].name }
  ]);
  await deleteAllTestHandovers();
});

deleteAllTestHandovers = () => {
  Handover.scan().exec(async (err, handovers) => {
    picked = [];
    handovers.forEach(({ id, entryDate }) => {
      picked.push({ id, entryDate });
    });
    await Handover.batchDelete(picked);
  });
};

describe("POST /api/handovers", () => {
  test("It should fail creating new handover without authentication", async () => {
    const response = await request(app)
      .post("/api/handovers")
      .send({
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name
      });
    expect(response.text).toEqual("Unauthorized");
    expect(response.statusCode).toBe(401);
  });

  test("It should successfully save a new handover", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: [
          {
            action: "solve it",
            link: "http://blahblah.com",
            description: "oh lala"
          },
          {
            action: "just close",
            link: "http://blahblah.com",
            description: "oh lala"
          }
        ]
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.statusCode).toBe(200);
  });
});