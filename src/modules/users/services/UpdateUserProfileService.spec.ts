import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHaskProvider';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let service: UpdateUserProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    service = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'test',
      password: '12345',
    });

    const updatedUser = await service.execute({
      user_id: user.id,
      name: 'Test 2',
      email: 'test2@test.com',
    });

    expect(updatedUser.name).toBe('Test 2');
    expect(updatedUser.email).toBe('test2@test.com');
  });

  it('should not be able to update user profile using invalid user', async () => {
    await expect(
      service.execute({
        user_id: 'invalid',
        name: 'Test 2',
        email: 'test2@test.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user profile wih already user email', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'test',
      password: '12345',
    });
    await fakeUsersRepository.create({
      email: 'test2@test.com',
      name: 'test',
      password: '12345',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'Test 2',
        email: 'test2@test.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'test',
      password: '12345',
    });

    const updatedUser = await service.execute({
      user_id: user.id,
      name: 'Test 2',
      email: 'test2@test.com',
      password: '123456',
      old_password: '12345',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update user password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'test',
      password: '12345',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'Test 2',
        email: 'test2@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'test',
      password: '12345',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'Test 2',
        email: 'test2@test.com',
        password: '123456',
        old_password: 'wrongOldPassword',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
