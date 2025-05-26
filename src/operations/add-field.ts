/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection } from 'mongoose';
import { MigrationOperation } from '../types.js';

export class AddField implements MigrationOperation {
  constructor(
    private readonly modelName: string,
    private readonly fieldName: string,
    private readonly fieldDefinition: any,
  ) {}

  async applyUp(connection: Connection): Promise<void> {
    const model = connection.model(this.modelName);
    const schema = model.schema;

    schema.add({ [this.fieldName]: this.fieldDefinition });
    // re-compile connection model
    connection.model(this.modelName, schema);
  }

  async applyDown(connection: Connection): Promise<void> {
    const model = connection.model(this.modelName);
    const schema = model.schema;

    schema.remove(this.fieldName);
    // re-compile connection model
    connection.model(this.modelName, schema);
  }
}
