import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHaskProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let service: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    service = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it('should be able to reset the password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await service.execute({ password: '123123', token });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('123123');

    expect(updatedUser?.password).toBe('123123');
  });

  it('should be delete userToken after reset the password', async () => {
    const deleteUserToken = jest.spyOn(fakeUserTokensRepository, 'delete');

    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await service.execute({ password: '123123', token });

    expect(deleteUserToken).toBeCalled();
  });

  it('should not be to reset password with non-existing token', async () => {
    await expect(
      service.execute({ password: '123123', token: '123asd' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be to reset password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('test id');

    await expect(
      service.execute({ password: '123123', token })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      service.execute({ password: '123123', token })
    ).rejects.toBeInstanceOf(AppError);
  });
});
