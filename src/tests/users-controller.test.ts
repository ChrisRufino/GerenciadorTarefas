import { app } from "@/app";
import { prisma } from "@/database/prisma";
import request from "supertest";

describe("UsersController", () => {
  let user_id: number;

  beforeAll(async () => {
    await prisma.users.deleteMany({ where: { email: "testeuser@gmail.com" } });
  });

  afterAll(async () => {
    if (user_id) {
      await prisma.users.deleteMany({ where: { id: user_id } });
    }
  });

  it("should create a new user sucessfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Teste user",
      email: "testeuser@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Teste user");

    user_id = response.body.id;
  });

  it("should thow an error if user with same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Teste user",
      email: "testeuser@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already in use");
  });

  it("should thow a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Teste user",
      email: "testeuser@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already in use");
  });
});
