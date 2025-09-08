import { Readable, Writable, Transform } from 'stream';

/**
 * Demonstrates the use of Node.js streams by piping data through a Transform stream.
 *
 * @definition
 * This function creates a readable stream from an array of strings, transforms each chunk to uppercase using a Transform stream,
 * and writes the result to a writable stream, accumulating the output into a single string. The function returns a Promise that
 * resolves with the final transformed string once the stream finishes processing.
 *
 * @usage
 * Use this function to understand how to work with Node.js streams, including Readable, Transform, and Writable streams.
 * It is useful for educational purposes or as a template for stream-based data processing in Node.js applications.
 *
 * @returns {Promise<string>} A promise that resolves to the concatenated, uppercased string after all stream operations complete.
 *
 * @example
 * ```typescript
 * streamExample().then(result => {
 *   console.log(result); // Output: "NODEJS STREAMS"
 * });
 * ```
 *
 * // Create a readable stream from an array of strings
 * // Transform each chunk to uppercase
 * // Accumulate the transformed chunks into a result string using a writable stream
 * // Pipe the streams together and resolve the promise when finished
 */
export function streamExample(): Promise<string> {
  return new Promise((resolve, reject) => {
    const readable = Readable.from(['Node', 'JS', ' ', 'Streams']);
    const transform = new Transform({
      transform(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
        callback(null, chunk.toString().toUpperCase());
      }
    });
    let result = '';
    const writable = new Writable({
      write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        result += chunk.toString();
        callback();
      }
    });
    readable.pipe(transform).pipe(writable).on('finish', () => resolve(result));
    writable.on('error', reject);
  });
}
