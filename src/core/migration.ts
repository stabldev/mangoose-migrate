import { Connection } from 'mongoose';
import { MigrationOperation } from '../types.js';

export class Migration {
  public readonly operations: MigrationOperation[] = [];

  async up(connection: Connection): Promise<void> {
    for (const operation of this.operations) {
      await operation.applyUp(connection);
    }
  }

  async down(connection: Connection): Promise<void> {
    // apply operations in reverse order
    for (let i = this.operations.length; i >= 0; i--) {
      await this.operations[i].applyDown(connection);
    }
  }

  addOperation(operation: MigrationOperation): void {
    this.operations.push(operation);
  }
}
