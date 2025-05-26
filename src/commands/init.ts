import fs from 'fs/promises';
import path from 'path';
import { CONFIG_FILES } from '../config.js';

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
    const override = await promptOverride();
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

async function promptOverride(): Promise<boolean> {
  console.warn('Override existing config file? (y/N) ');
  process.stdin.setEncoding('utf8');

  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim().toLowerCase() === 'y');
    });
  });
}
