import { app } from "@/app";
import request from "supertest";

import { prisma } from "@/database/prisma";

describe("SessionsController", () => {
  let user_id: number;

  afterAll(async () => {
    if (user_id) {
      await prisma.users.delete({ where: { id: user_id } });
    }
  });

  it("should athenticate a and get acess token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Teste user",
      email: "Authtesteuser2@gmail.com",
      password: "123456",
    });

    user_id = userResponse.body.id;

    const sessionResponse = await request(app).post("/sessions").send({
      email: "Authtesteuser2@gmail.com",
      password: "123456",
    });

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  });
});
