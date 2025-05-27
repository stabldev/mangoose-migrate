import mongoose, { Connection, Model } from 'mongoose';
import { MigrationModel } from '../types.js';

export class MigrationRecorder {
  private model: Model<MigrationModel>;

  constructor(private readonly connection: Connection) {
    this.model = null as unknown as Model<MigrationModel>;
    // init model
    this.init().catch((err) => {
      throw new Error(`MigrationRecorder failed to init: ${err}`);
    });
  }

  private async init(): Promise<void> {
    // proper init
    this.model = this.connection.model(
      'Migration',
      new mongoose.Schema<MigrationModel>({
        name: { type: String, required: true, unique: true },
        appliedAt: { type: Date, default: Date.now },
      }),
    );

    // create collection if doesn't exists
    await this.model.createCollection();
  }

  async isApplied(migrationName: string): Promise<boolean> {
    const count = await this.model.countDocuments({ name: migrationName });
    return count > 0;
  }

  async markAsApplied(migrationName: string): Promise<void> {
    await this.model.create({ name: migrationName });
  }

  async markAsUnApplied(migrationName: string): Promise<void> {
    await this.model.deleteOne({ name: migrationName });
  }

  async getAppliedMigrations() {
    const docs = await this.model.find().sort('appliedAt');
    return docs.map((doc) => doc.name);
  }
}
