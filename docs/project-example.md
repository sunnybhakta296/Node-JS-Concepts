# Node.js Concepts Covered in This Project

This project demonstrates the following core Node.js concepts, each with real code and API endpoints:

---

## 1. Middleware
- Express middleware for logging and request processing.

## 2. EventEmitter
- Custom event handling (e.g., `/event` endpoint).
- File upload notification using events.

## 3. Buffer
- Buffer creation, encoding, decoding (`/buffer` endpoints).

## 4. Streams
- Readable, writable, and transform streams.
- Piping streams (`/stream`, `/pipe/uppercase`).
- Manual backpressure handling (`/pipe/backpressure`).

## 5. File Upload
- Uploading files with Multer (`/upload`).

## 6. Thread Pool / Worker Threads
- Running CPU-bound tasks in worker threads (`/threadpool`).

## 7. V8 JavaScript Engine
- Object serialization/deserialization (`/v8/serialize`, `/v8/deserialize`).
- Heap statistics (`/v8/heap`).

## 8. Process
- Getting process info and memory usage (`/process/info`, `/process/memory`).
- Handling signals (SIGINT) in code.

## 9. Child Processes
- Running shell/system commands (`/child/exec`).
- Spawning Node.js scripts (`/child/spawn`).
- Forking Node.js modules with IPC (`/child/fork`).

## 10. Piping and Backpressure
- Demonstrates piping and manual backpressure in streams.

## 11. Swagger/OpenAPI Documentation
- API documentation available at `/api-docs`.

## 12. Cluster Module
- Scaling Node.js apps across CPU cores using the cluster module.



# Concept Definitions and Code Examples

## 1. Middleware
**Definition:** Middleware functions are functions that have access to the request and response objects in Express, and can modify or log requests before passing control to the next handler.
```typescript
// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

## 2. EventEmitter
**Definition:** The EventEmitter class allows you to create, emit, and listen for custom events in Node.js.
```typescript
import { EventEmitter } from 'events';
const emitter = new EventEmitter();
emitter.on('ping', (msg) => console.log(msg));
emitter.emit('ping', 'pong!');
```

## 3. Buffer
**Definition:** Buffers are used to handle binary data directly in memory, useful for file I/O, streams, and network operations.
```typescript
const buf = Buffer.from('hello');
console.log(buf.toString('base64'));
```

## 4. Streams & Piping
**Definition:** Streams are objects that let you read data from a source or write data to a destination in a continuous fashion. Piping connects streams together.
```typescript
import { Readable, Writable, Transform } from 'stream';
const readable = Readable.from(['node', 'js']);
const transform = new Transform({
  transform(chunk, _, cb) { cb(null, chunk.toString().toUpperCase()); }
});
const writable = new Writable({
  write(chunk, _, cb) { console.log(chunk.toString()); cb(); }
});
readable.pipe(transform).pipe(writable);
```

## 5. File Upload (Multer)
**Definition:** Multer is a middleware for handling multipart/form-data, used for uploading files in Express apps.
```typescript
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ filename: req.file.originalname });
});
```

## 6. Worker Threads
**Definition:** Worker threads allow running JavaScript in parallel on multiple threads, useful for CPU-intensive tasks.
```typescript
import { Worker } from 'worker_threads';
const worker = new Worker('./worker.js', { workerData: { num: 5 } });
worker.on('message', (msg) => console.log(msg));
```

## 7. V8 Engine
**Definition:** Node.js exposes some V8 engine features, such as object serialization and heap statistics, via the 'v8' module.
```typescript
import v8 from 'v8';
const buf = v8.serialize({ foo: 'bar' });
const obj = v8.deserialize(buf);
console.log(obj);
```

## 8. Process
**Definition:** The process object provides information and control over the current Node.js process.
```typescript
console.log(process.pid, process.platform);
console.log(process.memoryUsage());
process.on('SIGINT', () => console.log('Exiting'));
```

## 9. Child Process
**Definition:**  
The `child_process` module in Node.js enables you to create and control new operating system processes from your Node.js application. This is useful for running shell commands, executing external scripts, or distributing work across multiple Node.js processes. There are three main ways to create child processes:

- **exec:** Runs a command in a shell and buffers the output. Suitable for short-lived commands with small output.
- **spawn:** Launches a new process with a given command. Streams data in and out, making it suitable for long-running processes or large outputs.
- **fork:** Specifically designed to spawn new Node.js processes and set up a communication channel (IPC) between parent and child, allowing you to send messages back and forth.

Child processes can be used for tasks such as running system utilities, processing files, or parallelizing CPU-intensive work. Using child processes helps prevent blocking the main event loop, keeping your application responsive.

```typescript
import { exec, spawn, fork } from 'child_process';

// exec: Run a shell command and get the output as a buffer
exec('node -v', (err, stdout) => console.log(stdout));

// spawn: Start a new process and stream data
const child = spawn('node', ['script.js']);
child.stdout.on('data', (data) => console.log(`stdout: ${data}`));

// fork: Start a new Node.js process with IPC
const forked = fork('./childScript.js');
forked.send({ hello: 'world' });
forked.on('message', (msg) => console.log('Message from child:', msg));
```

**fork vs spawn:**

- **spawn:**  
    Creates a new process to run any command or executable. It streams data in and out, making it suitable for running non-Node.js programs or scripts, and for handling large outputs or long-running processes.

- **fork:**  
    Specifically designed to spawn new Node.js processes. It sets up an IPC (inter-process communication) channel between the parent and child, allowing you to send and receive messages (objects) easily. Use `fork` when you want to run another Node.js module and communicate with it.

**Scenario:**  
Use `spawn` when you need to run a shell command, external script, or binary (e.g., running `ffmpeg` for video processing). Use `fork` when you want to offload work to another Node.js script and need to exchange messages, such as distributing tasks to worker processes in a cluster or handling CPU-intensive computations in parallel.


## 10. Piping & Backpressure
**Definition:** Backpressure is a flow-control mechanism that prevents a writable stream from being overwhelmed by a fast readable stream.
```typescript
const canContinue = writable.write(chunk);
if (!canContinue) {
  readable.pause();
  writable.once('drain', () => readable.resume());
}
```

## 11. Swagger Docs
**Definition:** Swagger (OpenAPI) provides interactive API documentation for your endpoints.
```typescript
import swaggerUi from 'swagger-ui-express';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## 12. Thread Pool
**Definition:** Node.js uses a thread pool (libuv) for handling some asynchronous operations (like file I/O, DNS, crypto). For custom CPU-bound tasks, you can use the worker_threads module to create your own thread pool.

**Endpoint:**
- `GET /threadpool?number=5` — Runs a CPU-bound task (e.g., factorial) in a worker thread and returns the result.

**Code Example:**
```typescript
// threadPool.ts
import { Worker } from 'worker_threads';
import path from 'path';

export function runInThreadPool(taskData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'workerTask.js'), {
      workerData: taskData
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

// workerTask.js
const { parentPort, workerData } = require('worker_threads');
function compute(n) { return n <= 1 ? 1 : n * compute(n - 1); }
const result = compute(workerData.number);
parentPort.postMessage({ input: workerData.number, result });
```

**Usage:**
Send a GET request to `/threadpool?number=5` to compute the factorial of 5 in a worker thread.
---