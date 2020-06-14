import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const route = Router();
const profileController = new ProfileController();

route.use(ensureAuthenticated);

route.get('/', profileController.show);
route.put('/', profileController.update);

export default route;
