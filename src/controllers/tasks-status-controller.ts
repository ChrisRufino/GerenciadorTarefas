import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod";

class TasksStatusController {
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int(),
    });

    const bodySchema = z.object({
      status: z.enum(["pending", "making", "completed"]),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    const task = await prisma.tasks.findUnique({ where: { id } });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (task.status !== status) {
      const changedBy = Number(request.user?.id);

      await prisma.$transaction([
        prisma.tasks.update({
          data: { status },
          where: { id },
        }),
        prisma.tasks_history.create({
          data: {
            taskId: id,
            changedBy,
            oldStatus: task.status,
            newStatus: status,
          },
        }),
      ]);
    }

    return response.json();
  }
}

export { TasksStatusController };
