import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.int(),
      team_id: z.int(),
      title: z.string(),
      description: z.string(),
    });

    const { user_id, description, team_id, title } = bodySchema.parse(
      request.body,
    );

    await prisma.tasks.create({
      data: {
        assignedTo: user_id,
        teamId: team_id,
        title,
        description,
      },
    });
    return response.status(201).json();
  }

  async index(request: Request, response: Response) {
    const tasks = await prisma.tasks.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return response.json({ message: tasks }); // colocar tasks quand
  }
}

export { TasksController };
