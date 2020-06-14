import 'reflect-metadata';
import 'express-async-errors';
import '@shared/infra/typeorm/';
import '@shared/container';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
  if (error instanceof AppError) {
    return res
      .status(error?.statusCode)
      .json({ error: true, message: error.message });
  }
  console.log(error);
  return res
    .status(400)
    .json({ error: true, message: 'Internal server error' });
});
app.listen(3333, () => {
  console.log('Server rodando');
});
