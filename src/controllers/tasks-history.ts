import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class TasksHistory {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      taskId: z.coerce.number().int().optional(),
    });
    const { taskId } = querySchema.parse(request.query);

    const history = await prisma.tasks_history.findMany({
      where: {
        ...(taskId ? { taskId } : {}),
      },
      include: {
        change: { select: { name: true, email: true } }, // quem mudou
      },
      orderBy: { changedAt: "desc" },
    });

    return response.json(history);
  }
}

export { TasksHistory };
