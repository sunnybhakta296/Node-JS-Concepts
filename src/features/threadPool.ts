// Node.js uses a thread pool (libuv) for certain operations
//  (like file I/O, DNS, crypto), but for custom thread pool logic
//  (like running multiple tasks in parallel),
//  you can use the worker_threads module

import { Worker } from 'worker_threads';
import path from 'path';
/**
 * Executes a task in a separate worker thread using Node.js worker_threads.
 *
 * @param taskData - Data to be sent to the worker for processing.
 * @returns Promise resolving with the worker's result or rejecting on error/exit.
 */
export function runInThreadPool(taskData: any): Promise<any> {
    return new Promise((resolve, reject) => {
        // Create a new worker, passing the task data
        const worker = new Worker(path.resolve(__dirname, 'workerTask.js'), {
            workerData: taskData
        });

        // Listen for messages from the worker and resolve the promise
        worker.on('message', resolve);

        // Listen for errors from the worker and reject the promise
        worker.on('error', reject);

        // Listen for worker exit; reject if exit code is not zero
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}
