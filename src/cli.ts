#!/usr/bin/env node
import { Command } from "commander";
import mongoose from "mongoose";
import { MigrateCommand } from "./commands/migrate.js";

async function main() {
  const program = new Command();
  program.version("0.0.1");

  const dbUri = process.env.MONGODB_URI;
  if (dbUri === undefined) {
    console.error("Please provide MONGODB_URI environment variable");
    process.exit(1);
  }
  // create connection
  const connection = mongoose.createConnection(dbUri);

  // register migrate command
  program
    .command("migrate")
    .description("Run pending migrations")
    .action(async () => {
      try {
        const cmd = new MigrateCommand(connection);
        await cmd.execute();
      } catch (err) {
        console.error(`Migration failed: ${err}`);
        process.exit(1);
      }
    });

  // parse cmd args
  program.parse(process.argv);
}

main().catch((err) => {
  console.error(`Error: ${err}`);
  process.exit(1);
});
