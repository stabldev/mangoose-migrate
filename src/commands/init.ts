import fs from "fs/promises";
import path from "path";
import { CONFIG_FILES } from "../config.js";

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
    await fs.writeFile(configPath, CONFIG_TEMPLATE);
    console.log(`Initialized at ./${CONFIG_FILES[0]}`);
  }
}
