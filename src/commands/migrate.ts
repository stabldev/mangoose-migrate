import { Connection } from 'mongoose';
import { MigrationRecorder } from '../core/recorder.js';
import { MigrationLoader } from '../core/loader.js';
import { MigrationConfig } from '../types.js';
import { Migration } from '../core/migration.js';

export class MigrateCommand {
  constructor(
    private readonly connection: Connection,
    private readonly config: MigrationConfig,
  ) {}

  async execute(): Promise<void> {
    const recorder = new MigrationRecorder(this.connection);
    await recorder.init();
    const loader = new MigrationLoader(this.config.migrationsPath);

    const migrationFiles = await loader.getMigrationFiles();
    const appliedMigrations = await recorder.getAppliedMigrations();

    for (const file of migrationFiles) {
      if (appliedMigrations.indexOf(file)) continue;

      try {
        const migration = (await loader.loadMigration(file)) as unknown as Migration;

        await migration.up(this.connection);
        for (const operation of migration.operations) {
          operation.applyUp(this.connection);
        }

        await recorder.markAsApplied(file);
        console.log(`Migration applied: ${file}`);
      } catch (err) {
        console.error(`Failed to apply migration ${file}: ${err}`);
        throw err;
      }
    }
  }
}
