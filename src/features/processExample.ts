/**
 * Node.js Process Example
 *
 * Demonstrates how to use the process object to get environment info,
 *  memory usage, and handle signals.
 */

// Get current process info
export function getProcessInfo() {
  return {
    pid: process.pid,
    platform: process.platform,
    nodeVersion: process.version,
    uptime: process.uptime(),
    cwd: process.cwd(),
    env: process.env,
  };
}

// Get memory usage
export function getMemoryUsage() {
  return process.memoryUsage();
}

// Example: gracefully handle SIGINT (Ctrl+C)
export function setupSigintHandler(onExit: () => void) {
  process.on('SIGINT', () => {
    onExit();
    process.exit(0);
  });
}

/*
Example usage:

import { getProcessInfo, getMemoryUsage, setupSigintHandler } from './processExample';

console.log(getProcessInfo());
console.log(getMemoryUsage());
setupSigintHandler(() => console.log('Exiting gracefully!'));
*/
