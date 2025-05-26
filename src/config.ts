import path from "path";
import { MigrationConfig } from "./types.js";

export async function loadConfig(
  configPath?: string
): Promise<MigrationConfig> {
  const defaultConfig: Partial<MigrationConfig> = {
    migrationsPath: "./migrations",
    options: {
      authSource: "admin",
      bufferCommands: false,
    },
  };

  let customConfig: Partial<MigrationConfig> = {};

  try {
    const configFile = configPath || "mangoose-migrate.config.js";
    const fullPath = path.resolve(process.cwd(), configFile);
    const importConfigFile = await import(fullPath);
    customConfig = importConfigFile.default || importConfigFile;
  } catch (err) {
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
      "Database connection uri must be provided in config or MONGODB_URI env variable"
    );
  }

  return { ...defaultConfig, ...customConfig } as MigrationConfig;
}
