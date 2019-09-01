const request = require("supertest");
const app = require("../app");

const loginUser = async (alias, password) => {
  const loginResponse = await request(app)
    .post("/api/users/login")
    .send({ alias, password });

  return loginResponse.body.token;
};

module.exports = loginUser;
