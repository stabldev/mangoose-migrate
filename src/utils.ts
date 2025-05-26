import { Connection } from 'mongoose';

/**
 * Gracefully closes the MongoDB connection and exits the process.
 *
 * @param {mongoose.Connection} connection The MongoDB connection to close
 * @param {number} code Process exit code (0 for success, 1 for error)
 * @returns {Promise<void>} Nothing (exits process)
 */
export async function gracefulExit(connection: Connection, code: number): Promise<void> {
  try {
    await connection.close();
    process.exit(code);
  } catch (err) {
    console.error(`Failed to close connection: ${err}`);
    process.exit(code === 0 ? 1 : code);
  }
}

/**
 * Show prompt to override something with yes or no.
 *
 * @param {string} message The MongoDB connection to close
 * @returns {Promise<boolean>} Boolean as promise
 */
export async function promptOverride(message: string): Promise<boolean> {
  console.warn(`${message} (y/N) `);
  process.stdin.setEncoding('utf8');

  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim().toLowerCase() === 'y');
    });
  });
}
