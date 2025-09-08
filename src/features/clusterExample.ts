/**
 * Node.js Cluster Module Example
 *
 * Demonstrates how to use the cluster module to create a simple multi-process server.
 * Useful for taking advantage of multi-core systems by running multiple Node.js processes.
 */

import cluster from 'cluster';
import os from 'os';

export function startClusteredServer(startServer: () => void) {
  if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      // Optionally restart worker
      cluster.fork();
    });
  } else {
    startServer();
  }
}
