# 🥭 mangoose-migrate

![NPM Version](https://img.shields.io/npm/v/mangoose-migrate?style=flat-square)
![GitHub License](https://img.shields.io/github/license/moonlitgrace/mangoose-migrate?style=flat-square)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/moonlitgrace/mangoose-migrate/release.yml?style=flat-square)

A lightweight migration tool for Mongoose (MongoDB), inspired by Django's migration system.

> WIP 🚧

## Installation

```bash
npm install -D mangoose-migrate
```

Or use directly with npx:

```bash
npx mangoose-migrate [command]
# pnpm dlx mangoose-migrate [command]
```

## Basic Commands

Create new migration:

```bash
npx mangoose-migrate make <name>
```

Run migrations:

```bash
npx mangoose-migrate migrate
```

## Configuration

### Option 1: Environment Variables

```bash
export MONGODB_URI="mongodb://user:pass@localhost:27017/mydb?authSource=admin"
```

### Option 2: Config File

```js
// mangoose-migrate.config.js
module.exports = {
  connectionUri: 'mongodb://localhost:27017/mydb',
  migrationsPath: './migrations',
  options: {
    authSource: 'admin',
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
