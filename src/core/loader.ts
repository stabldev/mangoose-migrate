import fs from 'fs/promises';
import path from 'path';
import { MigrationFile } from '../types.js';

export class MigrationLoader {
  constructor(private readonly migrationsPath: string) {}

  async getMigrationFiles(): Promise<string[]> {
    try {
      // get all migration files with .js extension
      const files = await fs.readdir(this.migrationsPath);
      return files.filter((file) => file.endsWith('.js')).sort();
    } catch (err) {
      if ((err as { code: string | undefined }).code === 'ENOENT') {
        // create migrations dir if doesn't exist
        await fs.mkdir(this.migrationsPath, { recursive: true });
        return [];
      }
      throw err;
    }
  }

  async loadMigration(fileName: string): Promise<MigrationFile> {
    const fullPath = path.join(this.migrationsPath, fileName);
    const importedModule = await import(fullPath);
    const migrationModule = importedModule.default || importedModule;

    if (!migrationModule) {
      throw new Error(`Migration ${fileName} has no default export`);
    }

    return migrationModule;
  }
}
