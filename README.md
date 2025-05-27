# 🥭 mangoose-migrate

![NPM Version](https://img.shields.io/npm/v/mangoose-migrate?style=flat-square)
![GitHub License](https://img.shields.io/github/license/moonlitgrace/mangoose-migrate?style=flat-square)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/moonlitgrace/mangoose-migrate/ci.yml?style=flat-square)

A lightweight migration tool for Mongoose (MongoDB), inspired by Django's migration system.

## Installation

```bash
npm i -g mangoose-migrate
# or local
npm i -D mangoose-migrate
```

Or use directly with npx (recommended):

```bash
npx mangoose-migrate [command]
# pnpm dlx mangoose-migrate [command]
```

## Getting started with the CLI

Before you start make sure you setup `.env` file or `mangoose.config.js` config file so you don't need to provide cli arguments on each command.

To generate a `mangoose.config.js` config file in your project root with default options:

```bash
npx mangoose-migrate init
```

Other CLI commands:

```bash
npx mangoose-migrate make <name> # creates a migration file
npx mangoose-migrate migrate # run pending migrations
```

## Configuration

### Option 1: Environment Variables

```bash
export MONGODB_URI="mongodb://user:pass@localhost:27017/mydb?authSource=admin"
```

### Option 2: Config File

```js
// mangoose.config.js
export default {
  connectionUri: process.env.MONGODB_URI,
  migrationsPath: "./migrations",
  options: {
    authSource: "admin",
    retryWrites: true,
    // ...
  },
};
```

### Option 3: CLI Arguments

```bash
npx mangoose-migrate migrate \\
  --connection-uri "mongodb://localhost:27017/mydb" \\
  --migrations-path "./db/migrations"
```

### Options

| Key              | Required | Default          | Description                 |
| ---------------- | -------- | ---------------- | --------------------------- |
| `connectionUri`  | Yes      | -                | MongoDB connection uri      |
| `migrationsPath` | No       | `"./migrations"` | Path to migration files     |
| `options`        | No       | `{}`             | Mongoose connection options |

## Migration Example

```js
import { Migration } from 'mangoose-migrate/core';
import { CreateModel } from 'mangoose-migrate/operations';

export default class InitialMigration extends Migration {
  constructor() {
    super('initial');
  }

  async up(db) {
    this.addOperation(
      new CreateModel('User', {
        name: { type: String, required: true },
      }),
    );
  }
}
```

## Operations

- `CreateModel(modelName, schema)`
- `AddField(modelName, fieldName, definition)`

## License

MIT. See [LICENSE](LICENSE) for more information.
