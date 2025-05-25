import mongoose, { mongo } from "mongoose";
import { MangooseOptions } from "./types";

export class Mangoose {
  constructor(private readonly options: MangooseOptions) {}

  async connect(): Promise<void> {
    console.log("🥭: connecting to db");
    await mongoose.connect(this.options.connectionString);
  }

  async runMigrations(): Promise<void> {
    console.log("🥭: running migrations");
    // migrations logic
  }
}
