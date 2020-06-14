import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import User from '@modules/users/infra/typeorm/entities/User';

let fakeUsersRepository: FakeUsersRepository;
let service: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    service = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'test',
      password: '12345',
    });

    const profile = await service.execute({
      user_id: user.id,
    });

    expect(profile).toBeInstanceOf(User);
  });

  it('should not be able to show user profile withot invalid user_id', async () => {
    await expect(
      service.execute({
        user_id: 'invalid-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
