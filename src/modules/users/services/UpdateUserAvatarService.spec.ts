import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarSerivce from '@modules/users/services/UpdateUserAvatarService';

describe('CreateUser', () => {
  it('should be able to update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const service = new UpdateUserAvatarSerivce(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'Test',
      password: '123456',
    });

    await service.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update user avatar with not existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const service = new UpdateUserAvatarSerivce(
      fakeUsersRepository,
      fakeStorageProvider
    );

    await expect(
      service.execute({
        user_id: 'invalid-id',
        avatarFileName: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user avatar with existing file', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const service = new UpdateUserAvatarSerivce(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      name: 'Test',
      password: '123456',
    });

    await service.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await service.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
