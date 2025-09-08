## What is Node.js?
**Definition:**  
- Node.js is an open-source, cross-platform JavaScript runtime environment.
- It executes JavaScript code outside of a web browser.
- Node.js uses the V8 JavaScript engine (the same engine as Google Chrome) and provides an event-driven, non-blocking I/O model, making it efficient and suitable for building scalable network applications.
- Common applications include web servers, APIs, and real-time services.

**Example:**
```javascript
// Simple HTTP server in Node.js
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Node.js!');
});
server.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Event-Driven, Non-Blocking I/O Model

**Definition:**  
Node.js is built on an event-driven, non-blocking I/O architecture. This means that operations such as file reads, network requests, or database queries are initiated asynchronously—Node.js does not wait for them to finish before moving on to other tasks. Instead, it uses an event loop to monitor the completion of these operations and triggers callback functions or events when they are done.

**Key Points:**
- **Event-Driven:** Actions (like incoming HTTP requests or file operations) emit events, which are handled by registered callbacks.
- **Non-Blocking I/O:** Multiple I/O operations can be started in parallel without blocking the main thread, allowing Node.js to efficiently handle thousands of concurrent connections.
- **Single Threaded:** Node.js uses a single-threaded event loop, so there is no need to create a new thread for each request.
- **Ideal for I/O-Bound Tasks:** This model is especially suitable for web servers, APIs, and real-time applications where handling many simultaneous I/O operations is required.

**Example:**
```javascript
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('File content:', data);
});

console.log('File read initiated...');
// Output:
// File read initiated...
// (after file is read)
// File content: <contents of example.txt>
```

**Interview Tip:**  
Be ready to explain how the event loop and non-blocking I/O enable Node.js to scale and efficiently manage many simultaneous connections without blocking the main thread.

## Asynchronous Operations
**Definition:**  
- Asynchronous operations in Node.js let you start tasks (like file I/O, network requests, or database queries) without waiting for them to finish.
- Node.js continues executing other code while these operations run in the background.
- Results are handled using callbacks, promises, or async/await when the operation completes.
- This non-blocking model allows Node.js to efficiently manage many concurrent tasks and is key to its scalability.

**Example:**
```javascript
// Non-blocking file read
const fs = require('fs');
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});
console.log('File read initiated...');
```

---

## JavaScript Runtime
- A JavaScript runtime is an environment where JavaScript code is executed.
- In Node.js, the runtime consists of:
  - The V8 JavaScript engine (for executing JS code)
  - Standard libraries (for file system, networking, etc.)
  - APIs for interacting with the operating system
- Unlike browsers (which run JavaScript on the client side), Node.js provides a runtime for executing JavaScript on the server side.
- This enables backend development using JavaScript outside the browser.

**Example:**
```javascript
// Using Node.js runtime to access the file system
const fs = require('fs');
fs.writeFileSync('hello.txt', 'Hello from the Node.js runtime!');
console.log('File written successfully.');
```

---

## Middleware in Node.js/Express

**Definition:**  
Middleware functions in Express are functions that execute during the request-response cycle. They have access to the request (`req`) and response (`res`) objects, and the `next` function, which passes control to the next middleware. Middleware can be used for logging, authentication, parsing, error handling, and more.

**Types of Middleware:**
- **Application-level middleware:** Bound to an instance of `express()`.
- **Router-level middleware:** Bound to an instance of `express.Router()`.
- **Error-handling middleware:** Functions with four arguments (`err, req, res, next`).
- **Built-in middleware:** Provided by Express (e.g., `express.json()`).
- **Third-party middleware:** Installed via npm (e.g., `morgan`, `cors`, `helmet`).

**Application-level Middleware Example:**
```typescript
// Logging middleware (runs for every request)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
```

**Router-level Middleware Example:**
```typescript
import express from 'express';
const router = express.Router();

router.use((req, res, next) => {
    // Custom logic for routes in this router
    next();
});

router.get('/profile', (req, res) => {
    res.send('User profile');
});
app.use('/user', router);
```

**Built-in Middleware Example:**
```typescript
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
```

**Third-party Middleware Example:**
```typescript
import cors from 'cors';
import helmet from 'helmet';

app.use(cors());
app.use(helmet());
```

**Error-handling Middleware Example:**
```typescript
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
});
```

**Order Matters:**  
Middleware is executed in the order it is defined. Always define error-handling middleware after all other routes and middleware.

**Interview Tip:**
- Use middleware for cross-cutting concerns (logging, auth, parsing).
- Always call `next()` unless you end the response.
- Place error-handling middleware at the end of your middleware stack.

## Data Types in Node.js

**Definition:**  
Node.js (like JavaScript) supports several built-in data types for handling different kinds of values. Understanding these types is fundamental for writing robust Node.js applications.

**Primitive Data Types:**
- **String:** Represents textual data.
- **Number:** Represents both integer and floating-point numbers.
- **Boolean:** Represents logical true or false.
- **Undefined:** A variable that has not been assigned a value.
- **Null:** Represents the intentional absence of any object value.
- **Symbol:** Unique and immutable primitive value (ES6+).
- **BigInt:** For arbitrarily large integers (ES2020+).

**Reference Data Types:**
- **Object:** Collection of key-value pairs.
- **Array:** Ordered list of values.
- **Function:** Callable object.

**Example:**
```javascript
// Primitive types
const name = "Node.js";         // String
const version = 20;             // Number
const isActive = true;          // Boolean
let notAssigned;                // Undefined
const nothing = null;           // Null
const uniqueId = Symbol('id');  // Symbol
const bigNumber = 12345678901234567890n; // BigInt

// Reference types
const user = { id: 1, name: "Sunny" }; // Object
const numbers = [1, 2, 3];             // Array
function greet() {                     // Function
  console.log("Hello, Node.js!");
}
```

**Interview Tip:**  
Be ready to explain the difference between primitive and reference types, and how Node.js handles them internally.

## Global Variables in Node.js

**Definition:**  
Global variables in Node.js are variables or objects that are available in all modules without needing to import them. Some are built-in (like `__dirname`, `__filename`, `global`, `process`, etc.), while others can be added to the `global` object.

**Common Built-in Globals:**
- `__dirname`: The directory name of the current module.
- `__filename`: The full path of the current module file.
- `global`: The global namespace object (similar to `window` in browsers).
- `process`: Provides information and control over the current Node.js process.
- `Buffer`: Used for handling binary data.
- `setTimeout`, `setInterval`, `setImmediate`: Timer functions.

**Example:**
```javascript
console.log('Current directory:', __dirname);
console.log('Current file:', __filename);

// Adding a custom global variable
global.myVar = 'Hello, global!';
console.log(global.myVar); // Output: Hello, global!
```

**Interview Tip:**  
Avoid polluting the global namespace with custom variables—prefer module-level scope or explicit imports for maintainability.

---

## Optimizing the Performance of Node.js Applications
**Definition:**
Performance optimization in Node.js involves improving speed, memory usage, and scalability by using best practices such as asynchronous programming, efficient data handling, and minimizing blocking operations.

**Common Techniques:**
- Use asynchronous/non-blocking APIs
- Avoid blocking the event loop (no heavy computation in main thread)
- Use streams for large data
- Use clustering or worker threads for CPU-bound tasks
- Cache results where possible
- Monitor and profile memory/CPU usage

**Code Example: Before (Blocking):**
```typescript
// BAD: Blocking the event loop with a CPU-heavy task
app.get('/block', (req, res) => {
  // This will block all requests!
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i;
  res.send({ sum });
});
```

**Code Example: After (Non-blocking with Worker):**
```typescript
// GOOD: Offload heavy computation to a worker thread
import { Worker } from 'worker_threads';
app.get('/nonblock', (req, res) => {
  const worker = new Worker('./workerTask.js', { workerData: { n: 1e9 } });
  worker.on('message', (sum) => res.send({ sum }));
  worker.on('error', (err) => res.status(500).send(err.message));
});
// In workerTask.js:
// const { workerData, parentPort } = require('worker_threads');
// let sum = 0;
// for (let i = 0; i < workerData.n; i++) sum += i;
// parentPort.postMessage(sum);
```

**Interview Tip:**
- Always avoid blocking the event loop in Node.js. Use async APIs, streams, and worker threads for heavy tasks.

---

## Monitor and Profile Your Application
**Definition:**
Monitoring and profiling help you track your Node.js application's performance, resource usage, and detect memory leaks or bottlenecks. This is essential for production systems.

**Common Tools:**
- `console.time`, `console.profile` (built-in)
- Node.js Inspector (`node --inspect`)
- Chrome DevTools
- `clinic.js` (Doctor, Flame, Bubbleprof)
- `pm2` (process manager with monitoring)
- APMs (New Relic, Datadog, etc.)

**Code Example: Basic Profiling**
```typescript
console.time('dbQuery');
// ... run your query ...
console.timeEnd('dbQuery');
```

**Code Example: Heap Snapshot**
```bash
node --inspect app.js
# Open chrome://inspect in Chrome to take heap snapshots and profile CPU
```

**Code Example: Using pm2 for Monitoring**
```bash
npm install -g pm2
pm2 start app.js --watch
pm2 monit
```

**Interview Tip:**
- Always monitor CPU, memory, and event loop lag in production. Use profiling to find and fix performance issues.

---

## Alert System for Node.js App Crashes
**Definition:**
An alert system notifies you immediately if your Node.js application crashes or encounters a critical error, so you can respond quickly and minimize downtime.

**Best Practices:**
- Use process-level handlers for `uncaughtException` and `unhandledRejection` to log and alert on crashes.
- Integrate with external alerting tools (email, Slack, PagerDuty, etc.) or use a process manager like `pm2` with notification hooks.
- Never rely solely on these handlers for error recovery—always fix root causes.

**Code Example: Basic Crash Alert (Email/Slack integration can be added)**
- In production, unexpected errors (like bugs in dependencies or unhandled promise rejections) can cause your Node.js server to crash.
- Without an alert system, you may not be aware of the crash until users report issues or downtime.
- By listening for `uncaughtException` and `unhandledRejection`, you can:
  - Log the error details for troubleshooting.
  - Trigger alerts (such as sending an email or Slack message) to notify your team immediately.
- This enables faster incident response and helps minimize application downtime.

```typescript
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // TODO: Send alert (email, Slack, etc.)
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    // TODO: Send alert (email, Slack, etc.)
    process.exit(1);
});
```

**With pm2:**
- Use pm2's built-in restart and notification features to auto-restart and alert on crashes.

**Interview Tip:**
- Always log and alert on crashes in production. Use monitoring and alerting tools for reliability.

---

## Handling Errors in Node.js Applications
**Definition:**
Error handling in Node.js ensures your application can gracefully recover from or report unexpected situations, preventing crashes and improving reliability.

**Best Practices:**
- Always handle errors in callbacks and promises.
- Use try/catch for synchronous and async/await code.
- Use error-handling middleware in Express.
- Log errors and alert on critical failures.
- Never expose sensitive error details to clients.

**Code Example: Callback Error Handling**
```typescript
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('File read error:', err);
    return;
  }
  console.log(data.toString());
});
```

**Code Example: Promise Error Handling**
```typescript
someAsyncFunction()
  .then(result => console.log(result))
  .catch(err => console.error('Async error:', err));
```

**Code Example: Express Error Middleware**
```typescript
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

**Code Example: Uncaught Exception/Unhandled Rejection**
```typescript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
```

**Interview Tip:**
- Always handle errors at every layer. Use logging, monitoring, and alerting for production reliability.

---

## Route and Type in Node.js/Express
**Definition:**
- A **route** in Express is a URL pattern and HTTP method (GET, POST, etc.) that triggers a handler function.
- A **type** refers to TypeScript types used to define the shape of data (e.g., request, response, params, body) for type safety.

**Route Example:**
```typescript
// GET route
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

// POST route
app.post('/data', (req, res) => {
  res.json({ received: req.body });
});
```
**Wildcard and Not Found Route Example:**
```typescript
// Use for not found route , keep it at bottom
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
  });
```
```
// Wildcard route for handling all unmatched routes (404 Not Found)
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
```
**Interview Tip:**
- Always add a wildcard route at the end of your route definitions to handle 404 errors gracefully.
**Type Example (TypeScript):**
```typescript
import { Request, Response } from 'express';

// Typed route handler
app.post('/user/:id', (req: Request<{ id: string }, any, { name: string }>, res: Response) => {
  const userId = req.params.id; // string
  const name = req.body.name;   // string
  res.json({ userId, name });
});
```

**Interview Tip:**
- Always use TypeScript types for request/response in Express to catch errors early and improve code quality.

---



## Securing a Node.js Application

**Definition:**  
Securing a Node.js app involves implementing best practices and tools to protect against common web vulnerabilities such as XSS, CSRF, SQL injection, and data leaks. This includes using secure HTTP headers, validating input, managing authentication, and keeping dependencies up to date.

**Common Techniques:**
- Use HTTPS for all communication.
- Sanitize and validate all user input.
- Set secure HTTP headers (e.g., with Helmet).
- Use environment variables for secrets.
- Implement authentication and authorization.
- Keep dependencies updated and monitor for vulnerabilities.
- Implement Rate Limiting to Prevent brute-force and DoS attacks.

**Code Example: Basic Security with Helmet and Input Validation**
```typescript
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { body, validationResult } from 'express-validator';

const app = express();

// Set secure HTTP headers
app.use(helmet());

// Limit repeated requests to public APIs
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Prevent XSS attacks
app.use(xss());

// Prevent NoSQL injection
app.use(mongoSanitize());

// Parse JSON bodies
app.use(express.json());

// Example route with input validation
app.post('/login',
    body('username').isAlphanumeric().trim().escape(),
    body('password').isLength({ min: 8 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Authenticate user...
        res.send('Login successful');
    }
);

app.listen(3000, () => console.log('Secure app running on port 3000'));
```

**Interview Tip:**
- Always use Helmet, validate/sanitize input, and never store secrets in code. Regularly audit dependencies for vulnerabilities.

---

## Advantages of Node.js
- **Asynchronous and Non-blocking:** Handles many connections efficiently without blocking the main thread, making it ideal for I/O-heavy applications.
- **Single Programming Language:** Enables full-stack development using JavaScript for both client and server.
- **Fast Execution:** Built on the V8 JavaScript engine, Node.js executes code quickly.
- **Scalable:** Easily scales horizontally (across multiple machines) and vertically (across CPU cores with cluster/worker threads).
- **Large Ecosystem:** Rich npm ecosystem with thousands of open-source libraries and tools.
- **Real-time Capabilities:** Well-suited for real-time applications like chat, games, and collaborative tools.
- **Cross-platform:** Runs on Windows, Linux, and macOS.
- **Active Community:** Strong support and frequent updates from the open-source community.
- **JSON Support:** Native support for JSON makes it ideal for building APIs and working with NoSQL databases.
- **Microservices Friendly:** Lightweight and modular, making it a good fit for microservices architectures.

**Interview Tip:**
- Emphasize Node.js’s non-blocking I/O, scalability, and use of JavaScript across the stack as key advantages.


## package.json
**Definition:**  
- `package.json` is the main configuration file for a Node.js project.
- It contains:
  - Project metadata (name, version, description, author, license).
  - Scripts for common tasks (start, test, build, etc.).
  - `dependencies`: libraries required to run the project.
  - `devDependencies`: libraries needed only for development and testing.
- It enables easy management, sharing, and installation of project dependencies.
- Essential for reproducible builds and collaboration in Node.js projects.

**Example:**
```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.6.1"
  }
}
```

**Interview Tip:**  
Be ready to explain the difference between dependencies and devDependencies, and how scripts can automate tasks.

---

## package-lock.json
**Definition:**  
- `package-lock.json` is automatically generated by npm.
- It records the exact versions of every installed package and their dependencies.
- Ensures consistent and repeatable installs across different environments.
- Created or updated whenever you run `npm install` or update packages.
- Should be committed to version control to lock the dependency tree.
- Not meant to be edited manually.

**Key Points:**
- Guarantees reproducible builds by locking dependency versions.
- Should be committed to version control.
- Not meant to be edited manually.

**Interview Tip:**  
If asked, explain that `package-lock.json` helps avoid "works on my machine" problems by locking down the full dependency tree.

---


## API Versioning

**Definition:**  
API versioning allows you to support multiple versions of your API simultaneously, ensuring backward compatibility.

**Example:**
```javascript
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
```

---

## Environment Variables and Configuration

**Definition:**  
Environment variables are used to configure your Node.js application without hardcoding sensitive or environment-specific values (like API keys, database URLs, or secrets). The `process.env` object provides access to these variables.

**Example:**
```javascript
// .env file
DB_URL=mongodb://localhost:27017/mydb

// app.js
require('dotenv').config();
console.log(process.env.DB_URL);
```

**Interview Tip:**  
Use libraries like `dotenv` for local development and never commit secrets to version control.

---

## Error Handling and Best Practices

**Definition:**  
Proper error handling ensures your Node.js app is robust and secure. Use try/catch for synchronous code, `.catch()` for promises, and error-handling middleware in Express.

**Example:**
```javascript
// Express error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

**Interview Tip:**  
Always handle errors at every async boundary and never expose stack traces to end users in production.

---

## Security Best Practices

**Definition:**  
Node.js apps should be secured against common threats like XSS, CSRF, and injection attacks. Use security-focused middleware and validate all input.

**Example:**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

**Interview Tip:**  
Mention using `helmet`, `express-rate-limit`, and input validation libraries.

---

## Logging

**Definition:**  
Logging is essential for debugging and monitoring. Use libraries like `winston` or `pino` for structured, production-ready logs.

**Example:**
```javascript
const winston = require('winston');
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });
logger.info('Server started');
```

**Interview Tip:**  
Explain the importance of log levels and centralized log management.

---

## Caching

**Definition:**  
Caching improves performance by storing frequently accessed data in memory (e.g., using Redis or in-memory cache).

**Example:**
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache();
cache.set('key', 'value', 100);
console.log(cache.get('key'));
```

**Interview Tip:**  
Discuss when to use in-memory vs distributed cache.

---
## Cluster Module
**Definition:**
The Node.js cluster module allows you to create child processes (workers) that share the same server port. This enables you to take advantage of multi-core systems and handle more concurrent connections by running multiple Node.js processes.

**Code Example:**
```typescript
import cluster from 'cluster';
import os from 'os';

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
  // Start your server here
  app.listen(3000, () => console.log(`Worker ${process.pid} started`));
}
```

**Endpoint:**
- `GET /cluster/info` — Shows if the current process is primary or worker and its PID.

**Interview Tip:**
- Use the cluster module to scale Node.js apps across CPU cores. Each worker is a separate process, so memory is not shared.

---


## EventEmitter

**Definition:**  
The `EventEmitter` class in Node.js provides a way to implement the observer pattern, allowing you to define, emit, and listen for custom events. It is the foundation for many core Node.js modules (like streams, HTTP, and process), enabling asynchronous event-driven programming.

**Key Points:**
- You can register multiple listeners for the same event.
- Listeners are called in the order they were registered.
- Supports methods like `.on()`, `.once()`, `.emit()`, `.off()` (or `.removeListener()`), and `.removeAllListeners()`.

**Example:**
```typescript
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Register a listener for the 'ping' event
emitter.on('ping', (msg) => {
  console.log('Received:', msg);
});

// Emit the 'ping' event with a message
emitter.emit('ping', 'pong!'); // Output: Received: pong!
```

**Interview Tip:**  
Be ready to explain how EventEmitter enables decoupled, event-driven architectures in Node.js and how it is used internally by core modules.


## Buffer

**Definition:**  
A `Buffer` in Node.js is a raw memory allocation used to handle binary data directly, outside of the V8 JavaScript engine's normal string handling. Buffers are essential for working with file I/O, streams, network protocols, and any operation that requires manipulation of raw bytes.

**Key Points:**
- Buffers store sequences of bytes, not characters.
- Useful for reading/writing files, handling TCP streams, and processing binary protocols.
- Can be created from strings, arrays, or allocated with a specific size.

**Example:**
```javascript
// Create a buffer from a string
const buf = Buffer.from('hello');

// Convert buffer to base64 encoding
console.log(buf.toString('base64')); // Output: aGVsbG8=
```
**Interview Tip:**  
Be ready to explain why buffers are needed in Node.js (handling binary data efficiently) and how they differ from regular JavaScript strings.


## Streams & Piping

**Definition:**  
Streams are powerful abstractions in Node.js for handling data that is read from a source or written to a destination incrementally, rather than loading it all into memory at once. This makes them ideal for processing large files, network data, or any scenario where data arrives over time.

**Types of Streams:**
- **Readable:** For reading data (e.g., file streams, HTTP requests).
- **Writable:** For writing data (e.g., file streams, HTTP responses).
- **Duplex:** Both readable and writable (e.g., TCP sockets).
- **Transform:** Duplex streams that can modify or transform data as it passes through (e.g., compression, encryption).

**Piping:**  
Piping is a mechanism that connects the output of one stream directly into another, allowing data to flow automatically through a chain of processing steps.

**Example: Transforming and Logging Data with Streams**
```typescript
import { Readable, Writable, Transform } from 'stream';

// Create a readable stream from an array
const readable = Readable.from(['node', 'js']);

// Transform stream to convert data to uppercase
const transform = new Transform({
  transform(chunk, _, cb) {
    cb(null, chunk.toString().toUpperCase());
  }
});

// Writable stream to log output
const writable = new Writable({
  write(chunk, _, cb) {
    console.log(chunk.toString());
    cb();
  }
});

// Pipe data: readable -> transform -> writable
readable.pipe(transform).pipe(writable);
// Output:
// NODE
// JS
```
**Duplex Stream Example:**  
A duplex stream is both readable and writable. For example, a TCP socket is duplex: you can read data from it and write data to it.

```typescript
import { Duplex } from 'stream';

class EchoDuplex extends Duplex {
  _write(chunk, encoding, callback) {
    // Immediately push written data to readable side
    this.push(chunk);
    callback();
  }
  _read(size) {
    // No-op: data is pushed from _write
  }
}

const duplex = new EchoDuplex();

duplex.on('data', (chunk) => {
  console.log('Echoed:', chunk.toString());
});

duplex.write('hello duplex\n');
duplex.end();

_Output:_

Echoed: hello duplex

```

**Interview Tip:**  
Streams and piping are essential for efficient data processing in Node.js. They help reduce memory usage and enable real-time data handling for files, network sockets, and more.

## Piping & Backpressure
**Definition:** Backpressure is a flow-control mechanism that prevents a writable stream from being overwhelmed by a fast readable stream.
```typescript
const canContinue = writable.write(chunk);
if (!canContinue) {
  readable.pause();
  writable.once('drain', () => readable.resume());
}
```

## Worker Threads

**Definition:**  
Worker threads in Node.js enable you to run JavaScript code in parallel on multiple threads. This is especially useful for CPU-intensive tasks (such as image processing, data compression, or heavy computations) that would otherwise block the single-threaded event loop and degrade performance.

**Key Points:**
- Each worker runs in its own isolated thread with a separate event loop.
- Workers communicate with the main thread via messages (using `postMessage` and `on('message')`).
- Ideal for offloading CPU-bound work, keeping the main thread responsive for I/O.

**Example:**
```typescript
// main.js
import { Worker } from 'worker_threads';

const worker = new Worker('./worker.js', { workerData: { num: 5 } });

worker.on('message', (result) => {
  console.log('Result from worker:', result);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

worker.on('exit', (code) => {
  if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
});
```
```typescript
// worker.js
import { parentPort, workerData } from 'worker_threads';

// Example: compute factorial
function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

const result = factorial(workerData.num);
parentPort.postMessage(result);
```

**Interview Tip:**  
Use worker threads for CPU-bound tasks to prevent blocking the event loop. For I/O-bound tasks, Node.js's async model is usually sufficient.


## Thread Pool Use Case in Node.js

**When to Use:**  
Thread pools are ideal for offloading CPU-intensive or blocking operations—such as image processing, data compression, cryptography, or complex mathematical calculations—that would otherwise block the single-threaded Node.js event loop. By delegating these tasks to worker threads, you keep the main thread free to handle incoming requests and I/O efficiently.

**Practical Example:**  
Imagine a REST API endpoint `/api/compute-prime` that checks if a large number is prime. This operation is computationally expensive and, if performed on the main thread, would block other requests. By running the computation in a worker thread (using the `worker_threads` module), you ensure the server remains responsive.

**Advantages:**  
- **Non-blocking:** Keeps the event loop unblocked, allowing Node.js to serve other requests concurrently.
- **Parallelism:** Multiple heavy tasks can be processed in parallel, leveraging multi-core CPUs.
- **Scalability:** Improves throughput and responsiveness, making Node.js suitable for both I/O-bound and CPU-bound workloads.
- **Reliability:** Reduces risk of performance bottlenecks caused by synchronous or CPU-heavy code.

**Example Code:**
```typescript
// main.js
import { Worker } from 'worker_threads';
import express from 'express';

const app = express();

app.get('/api/compute-prime', (req, res) => {
  const number = parseInt(req.query.n as string, 10) || 1e7;
  const worker = new Worker('./prime-worker.js', { workerData: { number } });

  worker.on('message', (isPrime) => res.json({ number, isPrime }));
  worker.on('error', (err) => res.status(500).json({ error: err.message }));
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
```typescript
// prime-worker.js
import { parentPort, workerData } from 'worker_threads';

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

parentPort.postMessage(isPrime(workerData.number));
```

**Interview Tip:**  
Be ready to explain why CPU-bound tasks should be offloaded to worker threads or the thread pool in Node.js, and how this approach improves scalability and performance.

## UV_THREADPOOL_SIZE

**Definition:**  
`UV_THREADPOOL_SIZE` is an environment variable in Node.js that controls the number of threads in libuv's thread pool. By default, the thread pool has 4 threads, but you can increase it (up to 128) to allow more concurrent execution of asynchronous operations that use the thread pool (e.g., file system I/O, DNS lookups, crypto, compression).

**Usage Example:**

Set the environment variable before starting your Node.js process:

```bash
# Set thread pool size to 8
UV_THREADPOOL_SIZE=8 node app.js
```

Or in Windows Command Prompt:

```cmd
set UV_THREADPOOL_SIZE=8 && node app.js
```

**Code Example:**

```javascript
// heavyTask.js
const crypto = require('crypto');

console.time('pbkdf2');
for (let i = 0; i < 8; i++) {
    crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', () => {
        console.timeEnd('pbkdf2');
    });
}
```

Run with different `UV_THREADPOOL_SIZE` values to see the effect on parallelism.

**Explanation:**  
- Increasing `UV_THREADPOOL_SIZE` allows more tasks to run in parallel, reducing wait time for thread pool-bound operations.
- Useful for applications with many simultaneous file, DNS, or crypto operations.
- Does **not** affect CPU-bound JavaScript code (use worker threads for that).

**Tip:**  
Set `UV_THREADPOOL_SIZE` according to your server's CPU core count and workload. Too high a value may cause excessive context switching.

---


## Process in Node.js

**Definition:**  
The `process` global object in Node.js provides information about, and control over, the currently running Node.js process. It allows you to interact with the environment, manage signals, access environment variables, and handle process-level events.

**Key Features:**
- Access process ID, platform, and environment variables.
- Monitor memory and resource usage.
- Listen for and handle system signals (e.g., `SIGINT`, `SIGTERM`).
- Control process exit and exit codes.

**Example:**
```typescript
console.log('Process ID:', process.pid);
console.log('Platform:', process.platform);
console.log('Memory Usage:', process.memoryUsage());

// Handle Ctrl+C (SIGINT) gracefully
process.on('SIGINT', () => {
  console.log('SIGINT received. Exiting...');
  process.exit(0);
});
```

## Handling SIGINT, SIGTERM, and Graceful Shutdown in Node.js

**Definition:**  
- **SIGINT** is sent when you press Ctrl+C in the terminal to interrupt a process.
- **SIGTERM** is sent by the OS or process managers (like Docker, Kubernetes, PM2) to request a process to terminate gracefully.
- Handling these signals allows your Node.js app to shut down cleanly, close connections, and finish ongoing work before exiting, preventing data loss or corruption.

**How to handle:**  
Listen for both signals and perform cleanup (like closing servers) before exiting.

**Example:**
```javascript
const server = app.listen(3000);

function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('All connections closed. Exiting.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
```
**Interview Tip:**  
- Be ready to explain how to use the `process` object for environment configuration, graceful shutdown, and monitoring resource usage in Node.js applications.
- Always handle SIGINT and SIGTERM for graceful shutdown in production Node.js apps.

## process.stdin, process.stdout, and process.stderr

**Definition:**  
These are standard streams provided by Node.js for input and output:

- `process.stdin`: A readable stream for standard input (usually the keyboard or piped input).
- `process.stdout`: A writable stream for standard output (usually the terminal or console).
- `process.stderr`: A writable stream for standard error output (used for error messages).

**Usage Examples:**
```javascript
// Reading from stdin
process.stdin.on('data', (data) => {
  process.stdout.write(`You typed: ${data}`);
});

// Writing to stdout and stderr
process.stdout.write('This is standard output\n');
process.stderr.write('This is an error message\n');
```

**Interview Tip:**  
Use `process.stdout` for regular output and `process.stderr` for errors. These streams are useful for building CLI tools and handling input/output in Node.js scripts.


## Child Processes in Node.js

**Definition:**  
The `child_process` module allows Node.js applications to create and manage new operating system processes. This is useful for running shell commands, executing external scripts, or distributing CPU-intensive work across multiple processes to keep the main event loop responsive.

**Main Methods:**
- **exec:** Runs a command in a shell, buffers the output, and returns it via a callback. Best for short-lived commands with small output.
- **spawn:** Launches a new process with a given command and streams data in/out. Ideal for long-running processes or large outputs.
- **fork:** Spawns a new Node.js process and sets up an IPC (inter-process communication) channel for message passing between parent and child. Use for running Node.js modules and exchanging messages.

**Examples:**
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
  - Runs any executable or script.
  - Streams data (stdout, stderr).
  - Use for external programs or large/continuous output.
  
- **fork:**  
  - Runs a Node.js module (i.e., a JavaScript file executed by the Node.js runtime) as a child process.
  - Sets up a message-based IPC (Inter-Process Communication) channel between parent and child.
  - Use for parallelizing Node.js code and exchanging messages between processes.
  - Only works with Node.js scripts (not arbitrary executables).
  - Enables structured communication using `child.send()` and `child.on('message')`.

**When to Use:**
- Use `spawn` for running external commands or binaries (e.g., `ffmpeg`, shell scripts).
- Use `fork` to offload work to another Node.js script and communicate via messages (e.g., distributing tasks, parallel computations).

**Interview Tip:**  
Be ready to explain the differences between `exec`, `spawn`, and `fork`, and when to use each for process management and parallelization in Node.js.


## Worker Threads vs Child Processes in Node.js

**Worker Threads:**
- Use worker threads for parallelizing CPU-bound JavaScript code.
- Run JavaScript code in parallel threads within the same Node.js process.
- Share memory via `SharedArrayBuffer` and `Atomics`.
- Lightweight compared to child processes (lower overhead).
- Ideal for CPU-bound tasks that need to run in parallel without blocking the event loop.
- Communicate via message passing (`postMessage`/`on('message')`).

**Child Processes:**
- Use child processes for running external programs or isolating tasks that may crash or require separate environments.
- Spawn entirely separate OS processes (can run any executable, not just JS).
- Do not share memory; communicate via inter-process communication (IPC) channels.
- Higher overhead (each process has its own memory and event loop).
- Methods: `spawn`, `exec`, `fork`, `execFile`.

**Comparison Table:**

| Feature            | Worker Threads                | Child Processes           |
|--------------------|------------------------------|--------------------------|
| Memory             | Shared (with SharedArrayBuffer) | Isolated                 |
| Communication      | Message passing, shared memory | IPC (message passing)    |
| Overhead           | Low (threads)                 | High (full processes)    |
| Use Case           | CPU-bound JS tasks            | External scripts, isolation, parallel Node.js modules |
| API                | `worker_threads` module       | `child_process` module   |


**Summary Table:**

| Use Case                        | Worker Threads         | Child Processes         |
|----------------------------------|-----------------------|------------------------|
| CPU-bound JS tasks               | ✅                    | ❌                     |
| Run external programs/scripts    | ❌                    | ✅                     |
| Memory sharing                   | ✅ (with SharedArrayBuffer) | ❌              |
| Process isolation                | ❌                    | ✅                     |
| Overhead                         | Low                   | High                   |
| Communication                    | Message passing, shared memory | IPC (message passing) |

**Interview Tip:**  
Use worker threads for parallelizing heavy JavaScript code. Use child processes for running external programs or isolating tasks from the main process that may crash or require separate environments.












## Event Loop
**Definition:**
The event loop is the core mechanism in Node.js that handles asynchronous operations. It allows Node.js to perform non-blocking I/O by offloading operations and processing their callbacks when ready, even though JavaScript is single-threaded.

**Phases:**
- Timers (setTimeout, setInterval)
- I/O callbacks
- Idle, prepare
- Poll (retrieves new I/O events)
- Check (setImmediate)
- Close callbacks

**Code Example:**
```typescript
console.log('Start');
setTimeout(() => console.log('Timeout'), 0);
setImmediate(() => console.log('Immediate'));
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('NextTick'));
console.log('End');
// Output order: Start, End, NextTick, Promise, Immediate, Timeout (order may vary for Immediate/Timeout)
```

## process.nextTick vs setImmediate: Real-World Example

**Scenario:**  
Suppose you are building a server that processes incoming requests and needs to schedule some follow-up work after handling each request. You want to compare how `process.nextTick` and `setImmediate` affect the timing of these follow-up tasks.

**Example:**
```javascript
const http = require('http');

http.createServer((req, res) => {
    res.write('Processing request...\n');

    process.nextTick(() => {
        res.write('nextTick callback executed\n');
    });

    setImmediate(() => {
        res.write('setImmediate callback executed\n');
        res.end('Done\n');
    });

    res.write('Request handler finished\n');
}).listen(3000, () => console.log('Server running on port 3000'));
```

**What happens:**  
- `process.nextTick` runs its callback immediately after the current operation, before any I/O events (like `setImmediate`).

## Next Iteration of the Event Loop

**Definition:**  
A "next iteration" (or "tick") of the event loop refers to the process where Node.js completes the current phase and then moves on to the next phase in its event loop cycle. Each iteration allows Node.js to process new events, callbacks, and I/O operations, ensuring non-blocking behavior.

**Example:**
```javascript
console.log('Before next iteration');

setImmediate(() => {
    console.log('This runs in the next iteration of the event loop');
});

console.log('After scheduling setImmediate');
```
**Output:**
```
Before next iteration
After scheduling setImmediate
This runs in the next iteration of the event loop
```

**Explanation:**  
- `setImmediate` schedules a callback to run in the next iteration of the event loop, after the current poll phase completes.
- This mechanism is useful for deferring work until after I/O events or to avoid blocking the current phase.

**Related APIs:**
- `setImmediate(callback)`: Runs the callback on the next event loop iteration.
- `process.nextTick(callback)`: Runs the callback before the next event loop iteration, after the current operation completes.

**When to use:**  
Use `setImmediate` to schedule work that should happen after I/O events, and `process.nextTick` for work that must happen before the event loop continues.
-

**Output order when you make a request:**
```
Processing request...
Request handler finished
nextTick callback executed
setImmediate callback executed
Done
```

**Takeaway:**  
Use `process.nextTick` for work that must happen *before* the event loop continues, and `setImmediate` for work that should happen *after* I/O events in the next loop iteration.

**Interview Tip:**
- The event loop enables Node.js to handle many connections efficiently with a single thread.
- `process.nextTick` and Promises are handled before the event loop continues to the next phase.

---


