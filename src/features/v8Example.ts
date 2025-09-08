/*
// Example: Serialize, deserialize, and get heap stats using V8

import { v8SerializeExample, v8DeserializeExample, v8HeapStats } from './v8Example';

// Serialize an object (can include Map, Set, Buffer, etc.)
const buf = v8SerializeExample({ hello: 'world', map: new Map([[1, 2]]) });
console.log('Serialized Buffer:', buf);

// Deserialize the buffer back to an object
const obj = v8DeserializeExample(buf);
console.log('Deserialized Object:', obj);

// Get V8 heap statistics
const stats = v8HeapStats();
console.log('V8 Heap Stats:', stats);
*/

/**
 * V8 JavaScript Engine Integration in Node.js
 *
 * Node.js exposes some V8 features via the 'v8' module. This allows you to:
 *  - Serialize/deserialize complex objects (including Maps, Sets, Buffers, etc.) for fast inter-thread/process communication.
 *  - Get heap statistics for memory monitoring and tuning.
 *
 * Real-world use case:
 *   - Use v8.serialize to send complex objects between worker threads (unlike JSON, supports more types).
 *   - Use v8.getHeapStatistics to monitor memory usage in production.
 *
 * Example endpoint usage:
 *   POST /v8/serialize      { "foo": 123, "bar": [1,2,3] } => { "serialized": "...base64..." }
 *   POST /v8/deserialize    { "serialized": "...base64..." } => { "deserialized": { ... } }
 *   GET  /v8/heap           => { ...heap stats... }
 *
 * Example code:
 *   const buf = v8SerializeExample({ hello: 'world', map: new Map([[1,2]]) });
 *   const obj = v8DeserializeExample(buf);
 *   const stats = v8HeapStats();
 */
import v8 from 'v8';

/**
 * Serializes a JavaScript object using V8's internal serializer.
 * @param obj Any JS object (can include Map, Set, Buffer, etc.)
 * @returns Buffer containing the serialized data
 */
export function v8SerializeExample(obj: any): Buffer {
    return v8.serialize(obj);
}

/**
 * Deserializes a Buffer back into a JavaScript object using V8.
 * @param buffer Buffer containing V8-serialized data
 * @returns The original JS object
 */
export function v8DeserializeExample(buffer: Buffer): any {
    return v8.deserialize(buffer);
}

/**
 * Returns V8 heap statistics (memory usage, limits, etc.)
 */
export function v8HeapStats() {
    return v8.getHeapStatistics();
}

/*
Example usage:

const buf = v8SerializeExample({ hello: 'world' });
console.log('Serialized Buffer:', buf);

const obj = v8DeserializeExample(buf);
console.log('Deserialized Object:', obj);

const stats = v8HeapStats();
console.log('V8 Heap Stats:', stats);

Output example:
Serialized Buffer: <Buffer 00 01 0a 68 65 6c 6c 6f 05 77 6f 72 6c 64>
Deserialized Object: { hello: 'world' }
V8 Heap Stats: {
    total_heap_size: 12345678,
    total_heap_size_executable: 123456,
    total_physical_size: 12345678,
    total_available_size: 987654321,
    used_heap_size: 8765432,
    heap_size_limit: 2190000000,
    malloced_memory: 123456,
    peak_malloced_memory: 234567,
    does_zap_garbage: 0,
    number_of_native_contexts: 1,
    number_of_detached_contexts: 0
}
*/

// Example usage:
// const buf = v8SerializeExample({ hello: 'world' });
// const obj = v8DeserializeExample(buf);
// const stats = v8HeapStats();
