#!/usr/bin/env node
import { Command } from 'commander';
import mongoose from 'mongoose';
import { MigrateCommand } from './commands/migrate.js';
import { MakeCommand } from './commands/make.js';
import { loadConfig } from './config.js';
import { gracefulExit } from './utils.js';
import { InitCommand } from './commands/init.js';
import pkg from '../package.json' assert { type: 'json' };

// load env
import dotenv from 'dotenv';
dotenv.config();

const program = new Command();
program
  .name('mangoose-migrate')
  .description(pkg.description)
  .version(pkg.version)
  .option('-c, --config <path>', 'path to config file');

program
  .command('init')
  .description('Initialize the migration config')
  .action(async () => {
    try {
      const cmd = new InitCommand();
      await cmd.execute();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

program
  .command('make <name>')
  .description('Create a new migration file')
  .action(async (name) => {
    const options = program.opts();
    const config = await loadConfig(options.config);

    const connection = await mongoose
      .createConnection(config.connectionUri, {
        ...config.options,
      })
      .asPromise();

    connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });

    try {
      const cmd = new MakeCommand(config);
      await cmd.execute(name);
      await gracefulExit(connection, 0);
    } catch (err) {
      console.error(`Error creating migration: ${err}`);
      await gracefulExit(connection, 1);
    }
  });

program
  .command('migrate')
  .description('Run pending migrations')
  .action(async () => {
    const options = program.opts();
    const config = await loadConfig(options.config);

    const connection = await mongoose
      .createConnection(config.connectionUri, {
        ...config.options,
      })
      .asPromise();

    connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });

    try {
      const cmd = new MigrateCommand(connection, config);
      await cmd.execute();
      await gracefulExit(connection, 0);
    } catch (err) {
      console.error(`Migration failed: ${err}`);
      await gracefulExit(connection, 1);
    }
  });

// parse and run CLI
program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
