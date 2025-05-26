import fs from 'fs/promises';
import path from 'path';
import { CONFIG_FILES } from '../config.js';
import { promptOverride } from '../utils.js';

const CONFIG_TEMPLATE = `export default {
  connectionUri: process.env.MONGODB_URI,
  migrationsPath: "./migrations",
  options: {
    authSource: "admin",
    retryWrites: true,
    // ...
  },
};`;

export class InitCommand {
  async execute() {
    const configPath = path.resolve(process.cwd(), CONFIG_FILES[0]);

    // check if config file already exists
    await fs.access(configPath);
    console.warn(`Config file already exists at ${CONFIG_FILES[0]}`);
    const override = await promptOverride('Override existing config file?');
    if (!override) {
      throw new Error('Init cancelled');
    }

    // write config file
    await fs.writeFile(configPath, CONFIG_TEMPLATE);
    console.log(`Configuration file created at ./${CONFIG_FILES[0]}`);
    console.info(
      'Edit this file with your MongoDB connection details before running migrations.',
    );
  }
}
