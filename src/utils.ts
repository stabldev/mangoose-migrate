import { Connection } from "mongoose";

/**
 * Gracefully closes the MongoDB connection and exits the process.
 *
 * @param {mongoose.Connection} connection - The MongoDB connection to close
 * @returns {Promise<void>} Nothing (exits process)
 */
export async function gracefulExit(connection: Connection): Promise<void> {
  try {
    await connection.close();
    process.exit(0);
  } catch (err) {
    console.error(`Failed to close connection: ${err}`);
    process.exit(1);
  }
}
