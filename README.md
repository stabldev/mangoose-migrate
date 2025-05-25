# 🥭 mangoose

Mangoose is a lightweight migration tool for Mongoose (MongoDB), inspired by Django's migration system.

## Installation

```bash
npm i mangoose
```

## Basic Usage

```ts
import { Mangoose } from "mangoose";

const mangoose = new Mangoose({
  connectionString: "mongodb://localhost:27017/mydb",
});

await mangoose.connect();
await mangoose.runMigrations();
```

> Note: This is a placeholder package. Full functionality coming soon.
