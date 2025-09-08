// Import parentPort and workerData from the worker_threads module.
// parentPort: Used to communicate with the parent thread.
// workerData: Data passed from the parent thread to this worker.
const { parentPort, workerData } = require('worker_threads');

/**
 * Recursive function to compute the factorial of a number.
 * @param {number} n - The number to compute the factorial for.
 * @returns {number} - The factorial of n.
 */
function compute(n) {
    return n <= 1 ? 1 : n * compute(n - 1);
}

// Compute the factorial using the number provided in workerData.
const result = compute(workerData.number);

// Send the result back to the parent thread via parentPort.
parentPort.postMessage({ input: workerData.number, result });


// Key points:
// 
// The code uses Node.js worker threads to offload a CPU-bound task (factorial calculation).
// Communication between the main thread and worker is handled via parentPort.
// The recursive compute function calculates the factorial, which can be CPU-intensive for large numbers.
