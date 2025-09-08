// Example child script for use with forkNodeScript endpoint
// Receives a message from parent, responds with a message and its PID

process.on('message', (msg) => {
  process.send({ received: msg, pid: process.pid });
});
