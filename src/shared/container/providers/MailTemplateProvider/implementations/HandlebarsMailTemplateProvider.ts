import IMailProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IParseMailDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import handlebars from 'handlebars';
import fs from 'fs';

export default class HandlebarsMailTemplateProvider implements IMailProvider {
  public async parse({ file, variables }: IParseMailDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
