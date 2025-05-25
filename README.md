# 🥭 mangoose-migrate

A lightweight migration tool for Mongoose (MongoDB), inspired by Django's migration system.
> Note: WIP 🚧

## Installation

```bash
npm i -D mangoose-migrate
```

Or use directly with npx:
```bash
npx mangoose-migrate [command]
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

Set `MongoDB` URI:
```bash
export MONGODB_URI=mongodb://localhost:27017/mydb
```

Custom migrations path:
```bash
npx mangoose-migrate make users --path ./db/migrations
```

## Migration Example

```js
import { Migration } from 'mangoose-migrate/core';
import { CreateModel } from 'mangoose-migrate/operations';

export default class InitialMigration extends Migration {
  constructor() {
    super('initial');
  }

  async up(db) {
    this.addOperation(new CreateModel('User', {
      name: { type: String, required: true }
    }));
  }
}
```

## Operations

- `CreateModel(modelName, schema)`
- `AddField(modelName, fieldName, definition)`

## License

MIT. See [LICENSE](LICENSE) for more information.
