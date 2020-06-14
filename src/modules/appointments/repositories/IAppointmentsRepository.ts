import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dto/ICreateAppointmentDTO';
export default interface IAppointmentsRepository {
  findByDateAndProviderId(
    date: Date,
    providerId: string
  ): Promise<Appointment | undefined>;

  create(data: ICreateAppointmentDTO): Promise<Appointment>;
}
