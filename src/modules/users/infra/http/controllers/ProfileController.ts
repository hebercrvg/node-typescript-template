import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const service = container.resolve(ShowProfileService);
    const user = await service.execute({ user_id });
    delete user.password;
    return res.json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { name, email, password, old_password } = req.body;

    const service = container.resolve(UpdateUserProfileService);
    const user = await service.execute({
      name,
      email,
      password,
      old_password,
      user_id,
    });

    delete user.password;
    return res.json(user);
  }
}
