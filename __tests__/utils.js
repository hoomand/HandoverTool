const request = require("supertest");
const app = require("../app");

const createUser = async (alias, password) => {
  const newUser = await request(app)
    .post("/api/users/register")
    .send({ alias: alias, password: password });
  return newUser;
};

const loginUser = async (alias, password) => {
  const loginResponse = await request(app)
    .post("/api/users/login")
    .send({ alias, password });

  return loginResponse.body.token;
};

module.exports = { loginUser, createUser };
