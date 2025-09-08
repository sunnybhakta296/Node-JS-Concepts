
// ---
// Detailed difference between spawn and fork in Node.js:
//
// spawn:
//   - Launches any executable (node, bash, python, etc.) as a child process.
//   - Communication is via standard streams: stdout (standard output), stderr (standard error), stdin (input).
//   - No built-in IPC (inter-process communication) channel.
//   - Use for running system commands, external scripts, or non-Node.js executables.
//   - Example: spawn('ls', ['-l'])
//
// fork:
//   - Specialized for launching Node.js modules as child processes.
//   - Automatically sets up an IPC channel for message passing (process.send, process.on('message')).
//   - Only works with Node.js scripts (not arbitrary executables).
//   - Use for running Node.js child processes that need to communicate with the parent.
//   - Example: fork('worker.js')
//
// | Feature         | spawn                                 | fork (child_process.fork)                |
// |-----------------|---------------------------------------|------------------------------------------|
// | Target          | Any executable/script                 | Node.js modules only                     |
// | Communication   | Streams (stdout, stderr, stdin)       | Message passing (send, on('message'))    |
// | Built-in IPC    | No                                    | Yes                                      |
// | Use Case        | System commands, external scripts     | Node.js child processes with messaging   |
// | API             | spawn(command, args, options)         | fork(modulePath, args, options)          |
//


import { fork } from 'child_process';

// Fork a Node.js script and communicate via IPC
export function forkNodeScript(scriptPath: string, args: string[] = [], message?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const child = fork(scriptPath, args, { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
    if (message !== undefined) {
      child.send(message);
    }
    child.on('message', (msg) => {
      resolve(msg);
      child.kill();
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Child exited with code ${code}`));
    });
  });
}

/*
Example usage:

// In parent:
import { forkNodeScript } from './childProcessExample';
forkNodeScript('./childScript.js', [], { hello: 'world' }).then(console.log);

// In childScript.js:
process.on('message', (msg) => {
  process.send({ received: msg, pid: process.pid });
});
*/
/**
 * Node.js Child Process Example
 *
 * Demonstrates how to use the child_process module to run shell commands or spawn other Node.js scripts.
 * Useful for running CPU-bound tasks, external scripts, or system commands in a separate process.
 */

import { exec, spawn } from 'child_process';

// Run a shell command and get the output (async)
export function runShellCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve({ stdout, stderr });
    });
  });
}

// Spawn a Node.js script as a child process
export function spawnNodeScript(scriptPath: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args]);
    let output = '';
    child.stdout.on('data', (data) => (output += data));
    child.stderr.on('data', (data) => (output += data));
    child.on('close', () => resolve(output));
    child.on('error', reject);
  });
}

/*
Example usage:

import { runShellCommand, spawnNodeScript } from './childProcessExample';

runShellCommand('node -v').then(console.log);
spawnNodeScript('path/to/script.js', ['arg1', 'arg2']).then(console.log);
*/
