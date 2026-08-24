import { Request, Response } from "express";
import { z } from "zod";

class TasksLogController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      tasks_id: z.string,
    });
    return response.json({ message: "ok" });
  }
}

export { TasksLogController };
