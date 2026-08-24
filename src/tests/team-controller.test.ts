import { app } from "@/app";
import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { sign } from "jsonwebtoken";
import request from "supertest";

describe("TeamsController", () => {
  let team_id: number;
  let user_id: number;
  let token: string;

  beforeAll(async () => {
    const user = await prisma.users.create({
      data: {
        name: "Admin Test",
        email: "admintest@gmail.com",
        password: "123456",
        role: "administrator",
      },
    });

    user_id = user.id;

    token = sign({ role: user.role }, authConfig.jwt.secret, {
      subject: String(user.id),
      expiresIn: "1d",
    });
  });

  afterAll(async () => {
    if (team_id) {
      await prisma.teams.deleteMany({ where: { id: team_id } });
    }
    if (user_id) {
      await prisma.users.deleteMany({ where: { id: user_id } });
    }
  });

  it("testeando criacáo de time", async () => {
    const response = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Time de Test",
        description: "Testando aplicaçao jest",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    team_id = response.body.id;
  });
});
