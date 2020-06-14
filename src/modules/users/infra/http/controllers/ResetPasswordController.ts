import { Request, Response } from 'express';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import { container } from 'tsyringe';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { password, token } = req.body;

    const service = container.resolve(ResetPasswordService);
    await service.execute({
      password,
      token,
    });

    return res.status(204).json();
  }
}
