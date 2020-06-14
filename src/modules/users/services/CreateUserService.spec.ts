import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHaskProvider';
import CreateUsersService from '@modules/users/services/CreateUserService';
import User from '@modules/users/infra/typeorm/entities/User';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const service = new CreateUsersService(fakeRepository, fakeHashProvider);

    const user = await service.execute({
      email: 'test@test.com',
      name: 'Test Jest',
      password: '12345678',
    });

    expect(user).toBeInstanceOf(User);
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const service = new CreateUsersService(fakeRepository, fakeHashProvider);

    await service.execute({
      email: 'test@test.com',
      name: 'Test Jest',
      password: '12345678',
    });

    await expect(
      service.execute({
        email: 'test@test.com',
        name: 'Test Jest',
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
