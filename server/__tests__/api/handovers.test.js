const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const Team = require("../../models/Team");
const Handover = require("../../models/Handover");
const {
  createUser,
  loginUser,
  createTeam,
  createHandover
} = require("../utils");
const { randomText } = require("../../utils");

let test_user1 = {
  alias: "handover_test_user",
  password: randomText(10),
  token: ""
};

jest.setTimeout(30000);

const test_teams = [{ name: "handover_team_1" }, { name: "handover_team_2" }];

const test_items = [
  {
    status: "fresh",
    link: "http://one.com",
    description: "description 1"
  },
  {
    status: "investigated",
    link: "http://two.com",
    description: "description 2"
  },
  {
    status: "diagnosed",
    link: "http://three.com",
    description: "description 3"
  },
  {
    status: "monitor",
    link: "http://four.com",
    description: "description 4"
  }
];

beforeAll(async () => {
  const { alias, password } = test_user1;
  await createUser(alias, password);
  test_user1.token = await loginUser(alias, password);

  await createTeam(test_teams[0].name, test_user1.token);
  await createTeam(test_teams[1].name, test_user1.token);

  // To test GET handover
  await createHandover(
    test_teams[0].name,
    test_teams[1].name,
    test_items,
    test_user1.token
  );
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

describe("GET handovers", () => {
  test("It should get all the handovers", async () => {
    const response = await request(app).get("/api/handovers");

    expect(response.body.handovers).not.toHaveLength(0);
    expect(response.body.handovers[0]).toMatchObject({
      handingOverTeam: "handover_team_1",
      userAlias: "handover_test_user",
      handedOverTeam: "handover_team_2"
    });
    expect(response.statusCode).toBe(200);
  });
});

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

  test("It should fail creating new handover without handingOverTeam", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handedOverTeam: test_teams[1].name,
        items: test_items
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.body).toMatchObject({
      handingOverTeam: "Handing over team cannot be empty"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail creating new handover without handedOverTeam", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        items: test_items
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.body).toMatchObject({
      handedOverTeam: "Handed over team cannot be empty"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail creating new handover when handingOverTeam is the same as handedOverTeam", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[0].name,
        items: test_items
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.body).toMatchObject({
      handedOverTeam:
        "Handing over team and handed over team cannot be the same"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail creating new handover with a handingOverTeam that does not exist", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: "someNotDefinedTeam",
        handedOverTeam: test_teams[1].name,
        items: test_items
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      handingOverTeam: "handing over team is not registered"
    });
  });

  test("It should fail creating new handover with a handedOverTeam that does not exist", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: "someNotDefinedTeam",
        items: test_items
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      handedOverTeam: "handed over team is not registered"
    });
  });

  test("It should fail saving a new handover if given items are not array", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: "rogue items"
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });
    expect(response.body).toEqual({
      handoverItems: "Handover items should be an array"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail saving a new handover if each item in items array is not an object", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: ["rogue items"]
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });
    expect(response.body).toEqual({
      handoverItems: "Each handover item must be an object"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail saving a new handover if an item in items array does not have valid properties", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: [{ status: "blah", link: "whatevs" }]
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });
    expect(response.body).toEqual({
      handoverItems:
        "Each handover item must have a status, link and description property"
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail saving a new handover if an item in items array does not have valid status", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: [
          { status: "fresh", link: "whatevs", description: "" },
          { status: "blah", link: "something", description: "" }
        ]
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });
    expect(response.body).toEqual({
      handoverItems: "Handover item status is not valid",
      section: "status",
      index: 1
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should fail saving a new handover if an item in items array does not have valid url as for link", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        userAlias: test_user1.name,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: [
          { status: "fresh", link: "http://blahblah.com/id", description: "" },
          { status: "diagnosed", link: "something", description: "" }
        ]
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });
    expect(response.body).toEqual({
      handoverItems: "Handover item link is not a valid URL",
      section: "link",
      index: 1
    });
    expect(response.statusCode).toBe(400);
  });

  test("It should successfully save a new handover with zero items", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.statusCode).toBe(200);
  });

  test("It should successfully save a new handover", async () => {
    const { token } = test_user1;
    const response = await request(app)
      .post("/api/handovers")
      .send({
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: test_items
      })
      .set({
        "Content-Type": "application/json",
        Authorization: token
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        userAlias: test_user1.alias,
        handingOverTeam: test_teams[0].name,
        handedOverTeam: test_teams[1].name,
        items: test_items
      })
    );
  });
});
