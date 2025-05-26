import { Connection, ConnectOptions } from 'mongoose';
import { Document } from 'mongoose';

export interface MigrationModel extends Document {
  name: string;
  appliedAt: Date;
}

export interface MigrationOperation {
  applyUp(connection: Connection): Promise<void>;
  applyDown(connection: Connection): Promise<void>;
}

export interface MigrationFile {
  name: string;
  up(connection: Connection): Promise<void>;
  down(connection: Connection): Promise<void>;
}

export interface MigrationConfig {
  connectionUri: string;
  migrationsPath: string;
  options: ConnectOptions;
}
