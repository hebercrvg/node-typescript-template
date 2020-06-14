import { startOfHour } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const appointmentOnSameDate = await this.appointmentsRepository.findByDateAndProviderId(
      appointmentDate,
      provider_id
    );

    if (appointmentOnSameDate) {
      throw new AppError('This appointment is already booked.');
    }
    const appointment = await this.appointmentsRepository.create({
      date: appointmentDate,
      provider_id,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
