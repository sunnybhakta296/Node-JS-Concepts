// Definition: 
// This module demonstrates basic usage of Node.js Buffer for encoding and decoding data.
// Use case: 
// Useful for handling binary data, encoding/decoding strings, or working with streams in Node.js.
// Buffers are stored in Node.js as raw memory outside the V8 heap (not as JavaScript arrays).
// They are efficient for binary data and can be accessed/modified using methods like .toString(), .write(), .slice()
import { Buffer } from 'buffer';

/**
 * Converts a string to a Buffer and returns its UTF-8 representation.
 * Use case: Decoding buffer data to string for display or processing.
 */
export function bufferExample(): string {
    // Create a buffer from a string
    const buf = Buffer.from('Hello Buffer!');
    // Convert buffer back to UTF-8 string
    return buf.toString('utf8');
}

/**
 * Converts input data to a Buffer and returns its base64 encoding and length.
 * @param data - The input string to encode.
 * Use case: Encoding data for transmission/storage and checking its size.
 */
export function bufferFromData(data: string) {
    // Create a buffer from the input data
    const buf = Buffer.from(data);
    // Return base64 encoded string and buffer length
    return { base64: buf.toString('base64'), length: buf.length };
}
