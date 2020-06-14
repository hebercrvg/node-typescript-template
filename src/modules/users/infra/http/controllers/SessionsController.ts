import { Request, Response } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    console.log(email, password);
    const service = container.resolve(AuthenticateUserService);
    const { user, token } = await service.execute({
      email,
      password,
    });
    delete user.password;

    return res.json({ user, token });
  }
}
