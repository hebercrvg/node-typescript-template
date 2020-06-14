import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const service = new CreateAppointmentService(fakeAppointmentRepository);

    const appointment = await service.execute({
      date: new Date(),
      provider_id: '12345678',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same datetime', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const service = new CreateAppointmentService(fakeAppointmentRepository);

    const appointmentDate = new Date(2020, 4, 10, 11);

    await service.execute({
      date: appointmentDate,
      provider_id: '12345678',
    });

    expect(
      service.execute({
        date: appointmentDate,
        provider_id: '12345678',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
