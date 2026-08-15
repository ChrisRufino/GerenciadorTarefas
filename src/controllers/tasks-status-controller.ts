import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class TasksStatusController {
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.int(),
    });

    const bodySchema = z.object({
      status: z.enum(["pending", "making", "completed"]),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    await prisma.tasks.update({
      data: {
        status,
      },
      where: {
        id,
      },
    });

    return response.json();
  }
}

export { TasksStatusController };
