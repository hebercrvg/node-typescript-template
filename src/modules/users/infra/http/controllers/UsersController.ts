import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const user = await container.resolve(CreateUserService).execute({
      name,
      email,
      password,
    });

    delete user.password;

    return res.json(user);
  }
}
