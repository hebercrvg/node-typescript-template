import IMailProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IParseMailDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export default class FakeMailTemplateProvider implements IMailProvider {
  public async parse(): Promise<string> {
    return 'mail content';
  }
}
