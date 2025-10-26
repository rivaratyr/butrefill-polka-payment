import { Storage } from './Storage';

export class AppKitStorage implements Storage {
  private data: Map<string, any> = new Map();

  async getKeys(): Promise<string[]> {
    return Array.from(this.data.keys());
  }

  async getEntries<T = any>(): Promise<[string, T][]> {
    return Array.from(this.data.entries());
  }

  async getItem<T = any>(key: string): Promise<T | undefined> {
    return this.data.get(key);
  }

  async setItem<T = any>(key: string, value: T): Promise<void> {
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }
}