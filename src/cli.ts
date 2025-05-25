#!/usr/bin/env node
import { Command } from "commander";
import mongoose from "mongoose";
import { MigrateCommand } from "./commands/migrate.js";
import { MakeCommand } from "./commands/make.js";

const program = new Command();
program.version("1.0.0");

const dbUri = process.env.MONGODB_URI;
if (dbUri === undefined) {
  console.error("Please provide MONGODB_URI environment variable");
  process.exit(1);
}
// create connection
const connection = mongoose.createConnection(dbUri);

// register make command
program
  .command("make <name>")
  .option("-p, --path <path>", "migrations")
  .action(async (name, options) => {
    try {
      await new MakeCommand(connection, options.path).execute(name);
    } catch (err) {
      console.error("Error creating migration:", err);
      process.exit(1);
    }
  });

// register migrate command
program.command("migrate").action(async () => {
  try {
    const cmd = new MigrateCommand(connection);
    await cmd.execute();
  } catch (err) {
    console.error(`Migration failed: ${err}`);
    process.exit(1);
  }
});

// parse cmd args
program.parseAsync(process.argv).catch((err) => {
  console.error(`Program failed: ${err}`);
  process.exit(1);
});
