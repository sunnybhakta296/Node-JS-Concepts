import { EventEmitter } from 'events';

// Helper for emitting 'ping' event
export function emitPing(msg: string) {
	emitter.emit('ping', msg);
}

// Helper for listening to 'ping' event (one-time)
export function onPingOnce(callback: (msg: string) => void) {
	emitter.once('ping', callback);
}


export class MyEmitter extends EventEmitter {}
export const emitter = new MyEmitter();

// Helper for emitting file upload event
export function emitFileUploaded(filename: string) {
	emitter.emit('fileUploaded', filename);
}

// Helper for listening to file upload event (one-time)
/**
 * Registers a callback function to be invoked only once when the 'fileUploaded' event is emitted.
 *
 * @param callback - A function that will be called with the uploaded filename as its argument when the event occurs.
 */
export function onFileUploadedOnce(callback: (filename: string) => void) {
	emitter.once('fileUploaded', callback);
}
