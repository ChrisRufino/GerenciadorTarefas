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
      priority: z.enum(["high", "low", "average"]),
    });

    const { user_id, description, team_id, title, priority } = bodySchema.parse(
      request.body,
    );

    await prisma.tasks.create({
      data: {
        assignedTo: user_id,
        teamId: team_id,
        title,
        description,
        priority,
      },
    });
    return response.status(201).json();
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      status: z.enum(["pending", "making", "completed"]).optional(),
      priority: z.enum(["high", "low", "average"]).optional(),
    });

    const { status, priority } = querySchema.parse(request.query);

    // FILTRAR STATUS E PRIORIDADES

    // se for membro, só pode ver as tarefas dele mesmo
    const isMember = request.user?.role === "member";

    const tasks = await prisma.tasks.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(isMember ? { assignedTo: Number(request.user?.id) } : {}),
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return response.json({ message: tasks });
  }

  async assign(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int(),
    });

    const bodySchema = z.object({
      user_id: z.int(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { user_id } = bodySchema.parse(request.body);

    await prisma.tasks.update({
      where: { id },
      data: {
        assignedTo: user_id,
      },
    });

    return response.json();
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.tasks.delete({
      where: { id },
    });

    return response.status(204).json("Tasks Deletado");
  }
}

export { TasksController };
