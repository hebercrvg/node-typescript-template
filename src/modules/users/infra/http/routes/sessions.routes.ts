import { Router } from 'express';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const route = Router();
const sessionsController = new SessionsController();

route.post('/', sessionsController.create);

export default route;
