import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { container } from 'tsyringe';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const route = Router();
const appointmentsController = new AppointmentsController();
route.use(ensureAuthenticated);

// route.get('/', async (req, res) => {
//   return res.json(await appointmentsRepository.find());
// });

route.post('/', appointmentsController.create);

export default route;
