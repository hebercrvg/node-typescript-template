import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';

export default class FakeUserTokenRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuid(),
      user_id,
      token: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(x => x.token === token);
    return userToken;
  }

  public async delete(userToken: UserToken): Promise<void> {
    this.userTokens = this.userTokens.filter(x => x.token !== userToken.token);
  }
}
