export class Logger {
  static info(message) {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`);
  }

  static error(message, error) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
  }

  static success(message) {
    console.log(`[${new Date().toISOString()}] SUCCESS: ${message}`);
  }
}