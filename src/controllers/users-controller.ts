import { Request, Response } from "express";

class UsersController {
  async create(request: Request, response: Response) {
    return response.status(201).json({
      message: "user created sucessfully",
    });
  }
}

export { UsersController };
