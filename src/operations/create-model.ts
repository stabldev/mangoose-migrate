/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection } from 'mongoose';
import { MigrationOperation } from '../types.js';
import mongoose from 'mongoose';

export class CreateModel implements MigrationOperation {
  constructor(
    private readonly modelName: string,
    private readonly schemaDefinition: Record<string, any>,
  ) {}

  async applyUp(connection: Connection): Promise<void> {
    const schema = new mongoose.Schema(this.schemaDefinition);
    connection.model(this.modelName, schema);
  }

  async applyDown(connection: Connection): Promise<void> {
    connection.deleteModel(this.modelName);
  }
}
