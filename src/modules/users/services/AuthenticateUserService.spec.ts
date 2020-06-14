import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHaskProvider';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import User from '@modules/users/infra/typeorm/entities/User';

describe('CreateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const service = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider
    );
    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      email: 'test@test.com',
      password: '12345678',
      name: 'Test Jest',
    });

    const response = await service.execute({
      email: 'test@test.com',
      password: '12345678',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const service = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider
    );

    await expect(
      service.execute({
        email: 'test@test.com',
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const service = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider
    );
    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      email: 'test@test.com',
      password: '12345678',
      name: 'Test Jest',
    });

    await expect(
      service.execute({
        email: 'test@test.com',
        password: '12345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
