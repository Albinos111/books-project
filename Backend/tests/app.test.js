const request = require("supertest");
const app = require("../app");

describe("GET /api/time", () => {
  it("should return current time", async () => {
    const res = await request(app).get("/api/time");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("hour");
    expect(res.body).toHaveProperty("minute");
  });
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: `user_${Date.now()}`,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});

