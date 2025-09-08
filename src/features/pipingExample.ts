/**
 * Backpressure in Node.js Streams
 *
 * Backpressure is a flow-control mechanism that prevents a writable stream from being overwhelmed by data from a readable stream.
 * Node.js handles backpressure automatically when using .pipe(), but you can also manage it manually when using .write().
 *
 * Example: If writable.write(chunk) returns false, pause the readable stream and resume on 'drain'.
 */

import { Readable, Transform, Writable } from 'stream';

// Manual backpressure example: returns the output and the number of pauses
export function manualBackpressure(input: string, chunkSize = 2): Promise<{ output: string, pauses: number }> {
    return new Promise((resolve, reject) => {
        let result = '';
        let pauses = 0;
        const readable = new Readable({
            read() {
                for (let i = 0; i < input.length; i += chunkSize) {
                    this.push(input.slice(i, i + chunkSize));
                }
                this.push(null);
            }
        });
        const writable = new Writable({
            highWaterMark: 2, // small buffer to trigger backpressure
            write(chunk, _encoding, callback) {
                setTimeout(() => { // simulate slow write
                    result += chunk.toString();
                    callback();
                }, 10);
            }
        });
        readable.on('data', (chunk) => {
            const canContinue = writable.write(chunk);
            if (!canContinue) {
                pauses++;
                readable.pause();
                writable.once('drain', () => readable.resume());
            }
        });
        readable.on('end', () => writable.end());
        writable.on('finish', () => resolve({ output: result, pauses }));
        writable.on('error', reject);
    });
}
/**
 * Piping Streams Example
 *
 * Demonstrates how to pipe a readable stream to a writable stream, optionally
 *  through a transform stream.
 * In Node.js, piping streams means connecting the output of one stream directly
 *  to the input of another. This is commonly used for reading from a source
 * (like a file or HTTP request) and writing to a destination (like a file, HTTP response, or another stream) without manually handling the data events.
 */

// Pipe a readable stream to a writable stream (with optional transform)
/**
 * Pipes the input string through a transform stream that converts it to uppercase,
 * then collects the result and resolves it as a string.
 * @param input The input string to transform.
 * @returns A promise that resolves with the uppercase version of the input.
 */
export function pipeToUppercase(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Create a readable stream from the input string
        const readable = Readable.from([input]);
        // Transform stream to convert chunks to uppercase
        const transform = new Transform({
            transform(chunk, _encoding, callback) {
                callback(null, chunk.toString().toUpperCase());
            }
        });
        let result = '';
        // Writable stream to collect the transformed data
        const writable = new Writable({
            write(chunk, _encoding, callback) {
                result += chunk.toString();
                callback();
            }
        });
        // Pipe the streams: readable -> transform -> writable
        readable.pipe(transform).pipe(writable).on('finish', () => resolve(result));
        writable.on('error', reject);
    });
}
