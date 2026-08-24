import { app } from "@/app";
import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { sign } from "jsonwebtoken";
import request from "supertest";

describe("TeamsController", () => {
  let tasks_id: number;
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
    if (tasks_id) {
      await prisma.teams.delete({ where: { id: tasks_id } });
    }
    if (user_id) {
      await prisma.users.deleteMany({ where: { id: user_id } });
    }
  });

  it("testando criacáo de tarefa", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 4,
        description: "Teste tarefa",
        title: "Responder Email",
        priority: "high",
        team_id: 1,
      });

    expect(response.status).toBe(201);

    tasks_id = response.body.id;
  });
});
