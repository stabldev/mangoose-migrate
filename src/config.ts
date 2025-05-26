import path from 'path';
import { MigrationConfig } from './types.js';

// TODO: support more in future
export const CONFIG_FILES = ['mangoose.config.js', 'mangoose-migrate-config.js'];

export async function loadConfig(configPath?: string): Promise<MigrationConfig> {
  const defaultConfig: Partial<MigrationConfig> = {
    migrationsPath: './migrations',
    options: {
      authSource: 'admin',
      bufferCommands: false,
    },
  };

  let customConfig: Partial<MigrationConfig> = {};

  try {
    const configFile = configPath || CONFIG_FILES[0];
    const fullPath = path.resolve(process.cwd(), configFile);
    const importConfingModule = await import(fullPath);
    customConfig = importConfingModule.default || importConfingModule;
  } catch {
    if (configPath) {
      throw new Error(`Failed to load config file: ${configPath}`);
    } else {
      // ignore if default config file exists
    }
  }

  if (!customConfig.connectionUri && process.env.MONGODB_URI) {
    customConfig.connectionUri = process.env.MONGODB_URI;
  }

  if (!customConfig.connectionUri) {
    throw new Error(
      'Database connection uri must be provided in config or MONGODB_URI env variable',
    );
  }

  return { ...defaultConfig, ...customConfig } as MigrationConfig;
}
