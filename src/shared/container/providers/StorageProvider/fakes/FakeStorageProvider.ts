import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import fs from 'fs';
import uploadConfig from '@config/upload';
import path from 'path';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    this.storage = this.storage.filter(x => x !== file);
  }
}
