#!/usr/bin/env node
import { Command } from "commander";
import mongoose from "mongoose";
import { MigrateCommand } from "./commands/migrate.js";
import { MakeCommand } from "./commands/make.js";
import { loadConfig } from "./config.js";
import { logger } from "./utils.js";

async function main() {
  const program = new Command();
  program
    .name("mangoose-migrate")
    .version("1.0.0")
    .option("-c, --config <path>");

  // load configuration
  const options = program.opts();
  const config = await loadConfig(options.config);

  // create connection
  const connection = await mongoose
    .createConnection(config.connectionUri, {
      ...config.options,
    })
    .asPromise();

  connection.on("error", (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  // verify connection
  try {
    await connection.db?.command({ ping: 1 });
    logger.log("Successfully connected to MongoDB");
  } catch (err) {
    logger.error(`Failed to connect to MongoDB: ${err}`);
    process.exit(1);
  }

  // register make command
  program.command("make <name>").action(async (name) => {
    try {
      const cmd = new MakeCommand(connection, config);
      await cmd.execute(name);
    } catch (err) {
      logger.error(`Error creating migration: ${err}`);
      process.exit(1);
    }
  });

  // register migrate command
  program.command("migrate").action(async () => {
    try {
      const cmd = new MigrateCommand(connection, config);
      await cmd.execute();
    } catch (err) {
      logger.error(`Migration failed: ${err}`);
      process.exit(1);
    }
  });

  // parse cmd args
  program.parseAsync(process.argv).catch((err) => {
    logger.error(`Program failed: ${err}`);
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
