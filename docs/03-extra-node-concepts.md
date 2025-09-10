## CommonJS vs ES Modules in Node.js ##

**Definition:**  
- **CommonJS** is the original module system in Node.js, using `require()` and `module.exports`.  
- **ES Modules (ESM)** use `import` and `export` syntax, following the ECMAScript standard.

**Key Differences:**
- CommonJS loads modules synchronously; ESM is asynchronous.
- CommonJS uses `require()`/`module.exports`; ESM uses `import`/`export`.
- ESM supports static analysis and tree-shaking.

**Examples:**

*CommonJS:*
```js
// math.js
module.exports.add = (a, b) => a + b;

// app.js
const math = require('./math');
console.log(math.add(2, 3));
```

*ES Modules:*
```js
// math.mjs
export function add(a, b) { return a + b; }

// app.mjs
import { add } from './math.mjs';
console.log(add(2, 3));
```

---

**Protecting Node.js Apps from SQL Injection**

**Definition:**  
SQL injection is a security vulnerability where attackers inject malicious SQL into queries. Prevent it by never concatenating user input into SQL statements.

**How to Protect:**
- Use parameterized queries or ORM libraries.
- Validate and sanitize all user input.

**Example (using parameterized queries with `mysql2`):**
```js
const mysql = require('mysql2');
const conn = mysql.createConnection({ /* config */ });
const userId = req.body.userId;
conn.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
  // Safe from SQL injection
});
```

---

**Callback Hell and How to Avoid It**

**Definition:**  
Callback hell refers to deeply nested callbacks, making code hard to read and maintain.

**How to Avoid:**
- Use named functions, Promises, or async/await.

**Example (callback hell):**
```js
fs.readFile('a.txt', (err, data) => {
  fs.readFile('b.txt', (err2, data2) => {
    fs.readFile('c.txt', (err3, data3) => {
      // Nested callbacks
    });
  });
});
```

**Example (using Promises):**
```js
const fs = require('fs').promises;
Promise.all([
  fs.readFile('a.txt'),
  fs.readFile('b.txt'),
  fs.readFile('c.txt')
]).then(([a, b, c]) => {
  // All files read
});
```

**Example (using async/await):**
```js
async function readFiles() {
  const a = await fs.readFile('a.txt');
  const b = await fs.readFile('b.txt');
  const c = await fs.readFile('c.txt');
}
```

---

**Promise vs Async/Await**

**Definition:**  
- **Promise:** An object representing the eventual completion or failure of an async operation.
- **async/await:** Syntactic sugar over Promises for writing async code in a synchronous style.


**Using the `cors` Middleware (Express):**
The easiest way to handle CORS in an Express app is by using the `cors` package.

**Example:**
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes

app.get('/data', (req, res) => {
  res.json({ message: 'CORS enabled!' });
});

app.listen(3000);
```

**Custom CORS Headers:**
You can also manually set CORS headers if you need more control.

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

**Interview Tip:**  
Always restrict CORS to trusted origins in production for better security.



## Helmet.js and Security Headers

**Definition:**  
Helmet.js is a middleware for Express applications that helps secure your Node.js apps by setting various HTTP headers. These headers protect against common web vulnerabilities such as cross-site scripting (XSS), clickjacking, and other attacks by configuring browser behavior.

**How it helps:**  
- Sets security-related HTTP headers automatically.
- Helps prevent attacks like XSS, clickjacking, and sniffing.
- Easy to use and configure for different security needs.

**Example:**
```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet()); // Enable all default security headers

app.get('/', (req, res) => {
  res.send('Helmet is protecting this app!');
});

app.listen(3000);
```

**Interview Tip:**  
Always use Helmet.js (or similar middleware) in production to improve your app’s security posture with minimal effort.


## Throttle and Debounce in Node.js

**Definition:**  
- **Throttling** ensures a function is only called at most once in a specified time interval, even if triggered multiple times.
- **Debouncing** delays function execution until a certain period has passed since the last trigger, useful for reducing noise from rapid events.

**Throttle Example:**
```javascript
function throttle(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

// Usage
const throttledLog = throttle(console.log, 1000);
setInterval(() => throttledLog('Throttled!'), 200); // Logs once per second
```

**Debounce Example:**
```javascript
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Usage
const debouncedLog = debounce(console.log, 1000);
for (let i = 0; i < 5; i++) debouncedLog('Debounced!'); // Logs once after 1s
```

**Interview Tip:**  
Use throttling for rate-limiting (e.g., API calls) and debouncing for events like search input or resize.


## Monitoring CPU and Memory Usage in Node.js

**Definition:**  
Monitoring CPU and memory usage helps you track resource consumption and detect performance issues in your Node.js applications. Node.js provides built-in APIs and external tools for this purpose.

**Built-in Methods:**
- `process.memoryUsage()`: Returns an object describing the memory usage (heap, RSS, etc.).
- `process.cpuUsage()`: Returns the user and system CPU time used by the current process.

**Example (logging usage periodically):**
```javascript
setInterval(() => {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();
  console.log(`Memory: RSS=${mem.rss}, HeapUsed=${mem.heapUsed}`);
  console.log(`CPU: user=${cpu.user}, system=${cpu.system}`);
}, 5000); // Log every 5 seconds
```

**External Tools:**
- **Node.js Inspector**: Run with `node --inspect` and use Chrome DevTools for profiling.
- **pm2**: Process manager with built-in monitoring (`pm2 monit`).
- **top/htop**: System-level monitoring for CPU/memory usage.
- **clinic.js**: Advanced profiling and diagnostics.

**Interview Tip:**  
Combine in-app metrics with external monitoring for comprehensive observability in production.



## Strategies for Testing Asynchronous Code in Node.js

- **Callbacks:** Use `done` callback in test frameworks (e.g., Mocha) to signal test completion.
- **Promises/async-await:** Return a promise or use `async` functions in tests.
- **Timers:** Use fake timers (e.g., `sinon.useFakeTimers()`) to control time-based code.
- **Streams/Events:** Listen for events and assert results when events fire.
- **External Resources:** Mock dependencies (e.g., file system, network) to avoid side effects.

---uilt-in modules and popular testing libraries like `jest`, `mocha`, `chai`, and `supertest` where appropriate.
---


## WebSockets and Real-Time Communication

**Definition:**  
WebSockets provide full-duplex communication channels over a single TCP connection, enabling real-time features like chat, notifications, and live updates. Libraries like `ws` and `socket.io` make it easy to implement WebSockets in Node.js.

**Example (ws):**
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', ws => {
  ws.on('message', message => {
    ws.send(`Echo: ${message}`);
  });
  ws.send('Welcome to WebSocket server!');
});
```

---

## Native Addons (C++ Addons)

**Definition:**  
Node.js can be extended with native C/C++ code using N-API or node-gyp. This is useful for performance-critical operations or integrating with existing native libraries.

**Example:**
```cpp
// addon.cc
#include <napi.h>
Napi::String Hello(const Napi::CallbackInfo& info) {
  return Napi::String::New(info.Env(), "Hello from C++ addon!");
}
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, Hello));
  return exports;
}
NODE_API_MODULE(addon, Init)
```
```javascript
// index.js
const addon = require('./build/Release/addon');
console.log(addon.hello());
```

---



## Microservices and Message Queues

**Definition:**  
Microservices architecture splits an application into small, independent services. Message queues (like RabbitMQ, Kafka) enable communication between services asynchronously.

**Example (using amqplib for RabbitMQ):**
```javascript
const amqp = require('amqplib');
async function sendMsg() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('tasks');
  ch.sendToQueue('tasks', Buffer.from('Hello from microservice!'));
  setTimeout(() => conn.close(), 500);
}
sendMsg();
```

---

## Serverless with Node.js

**Definition:**  
Serverless computing lets you run Node.js code in the cloud without managing servers. Popular platforms include AWS Lambda, Azure Functions, and Google Cloud Functions.

**Example (AWS Lambda handler):**
```javascript
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' })
  };
};
```

---

## File System Watchers

**Definition:**  
Node.js can monitor file changes in real time using `fs.watch` or libraries like `chokidar`.

**Example:**
```javascript
const fs = require('fs');
fs.watch('file.txt', (eventType, filename) => {
  console.log(`${filename} changed: ${eventType}`);
});
```

---

## Dependency Injection

**Definition:**  
Dependency Injection (DI) is a design pattern for managing dependencies in a scalable way. Libraries like `awilix` or `inversify` provide DI containers for Node.js.

**Example (awilix):**
```javascript
const { createContainer, asClass } = require('awilix');
class UserService { /* ... */ }
const container = createContainer();
container.register({ userService: asClass(UserService) });
const userService = container.resolve('userService');
```

---


## Strategies for Rolling Updates and Zero-Downtime Deployments in Node.js

**Definition:**  
Rolling updates and zero-downtime deployments aim to update your Node.js application without interrupting service for users. This is crucial for high-availability systems.

**Common Strategies:**

- **Load Balancer with Multiple Instances:**  
  Run multiple instances of your app behind a load balancer (e.g., Nginx, AWS ELB). Update instances one at a time, removing each from the load balancer before updating, then adding it back after verifying health.

- **Process Managers (PM2, Forever):**  
  Use process managers like PM2, which support zero-downtime reloads (`pm2 reload <app>`). PM2 spins up new processes before shutting down old ones.

- **Blue-Green Deployment:**  
  Maintain two environments (blue and green). Deploy the new version to the idle environment, run tests, then switch traffic to it. Roll back by switching back if issues arise.

- **Canary Releases:**  
  Gradually route a small percentage of traffic to the new version. Monitor for errors before increasing traffic.

- **Graceful Shutdown:**  
  Ensure your app handles `SIGTERM`/`SIGINT` signals to finish ongoing requests before exiting. This prevents dropped connections during updates.

**Example (Graceful Shutdown):**
```javascript
const server = app.listen(3000);
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
});
```

**Interview Tip:**  
Always automate health checks and use orchestration tools (Docker, Kubernetes) for robust zero-downtime deployments.


## Creating Custom Promisified Utilities

**Definition:**  
To modernize callback-based functions, you can wrap them in a Promise, allowing usage with `async/await` or `.then()`. This is useful for legacy APIs or your own utilities that follow the Node.js callback pattern `(err, result)`.

**Example (Manual Promisification):**
```javascript
function readFileAsync(path, encoding) {
  return new Promise((resolve, reject) => {
    require('fs').readFile(path, encoding, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

// Usage with async/await
(async () => {
  try {
    const content = await readFileAsync('file.txt', 'utf8');
    console.log(content);
  } catch (err) {
    console.error(err);
  }
})();
```

**Generic Utility:**
```javascript
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
}

// Usage
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
```

**Interview Tip:**  
Node.js provides `util.promisify` for this purpose, but understanding manual promisification is important for custom or non-standard callback signatures.



 ### How does Node.js handle DNS and file system operations under the hood? Are they truly non-blocking? ###
  - Node.js uses libuv to offload DNS and file system operations to a thread pool, making them non-blocking from the main thread's perspective.
  - Some operations (like DNS lookup) can be either async (thread pool) or sync (blocking), depending on the method used.
   
   **Example:**
    
   ```js
    const fs = require('fs');
    fs.readFile('file.txt', 'utf8', (err, data) => {
      if (!err) console.log(data);
    });

    // This does not block the event loop.
   ```
 

 ### Explain the Node.js module resolution algorithm. What happens when you require('foo')? ###
  - Node.js looks for 'foo' in the following order:
    1. As a core module (like 'fs', 'http')
    2. As a file or folder in the current directory (e.g., './foo.js', './foo/index.js')
    3. In node_modules folders up the directory tree
  - If not found, it throws a `MODULE_NOT_FOUND` error.

  **Example:**
  ```js
  const fs = require('fs'); // Loads core module
  const myUtil = require('./utils/myUtil'); // Loads local file
  ```

### How does garbage collection work in V8? What are generational and incremental GC? ###
  - V8 uses generational garbage collection: short-lived objects are collected quickly (young generation), long-lived objects less frequently (old generation).
  - Incremental GC means the collector works in small steps to avoid blocking the main thread for too long.
  
  **Example:**

  ```js
  let arr = [];
  for (let i = 0; i < 1e6; i++) arr.push({});
  // If arr = null, objects can be garbage collected.
  arr = null;
  ```

## Performance & Optimization ##

### How would you diagnose and fix a high CPU usage issue in a Node.js application? ###
  - Use tools like `top`, `htop`, or `clinic.js` to identify the process and function causing high CPU.
  - Profile the app with Chrome DevTools or Node.js Inspector.
  - Optimize or refactor the slow code.

   **Example:**
  ```js
  // BAD: Blocking loop
  while(true) {}
  // Fix: Move heavy work to a worker thread
  ```

### What is the event loop delay? How can you measure and reduce it? ###
  - Event loop delay is the time the event loop takes to process queued callbacks. High delay means the main thread is blocked.
  - Measure with `process.hrtime()`, `perf_hooks.monitorEventLoopDelay()`, or `clinic.js`.
  - Reduce by avoiding blocking code and offloading heavy work.

  **Example:**
  ```js
  const { monitorEventLoopDelay } = require('perf_hooks');
  const h = monitorEventLoopDelay();
  h.enable();
  setTimeout(() => {
    h.disable();
    console.log('Event loop delay:', h.mean);
  }, 1000);
  ```

### How do you profile a memory leak using heap snapshots and flame graphs? ###
  - Use `node --inspect` and Chrome DevTools to take heap snapshots before and after suspected leaks.
  - Use `clinic flame` or `0x` to generate flame graphs and spot memory growth.
  - **Example:**
    ```bash
    node --inspect app.js
    # In Chrome: chrome://inspect → take heap snapshot
    ```

### Explain how you would horizontally scale a Node.js application behind a load balancer. ###
  - Run multiple Node.js instances (on same or different machines).
  - Use a load balancer (Nginx, AWS ELB, etc.) to distribute requests.
  - Ensure statelessness or use shared storage/session store.

   **Example:**
  ```bash
  # Start multiple Node.js servers
  node app.js & node app.js &
  # Use Nginx as a load balancer
  ```

### What is the difference between clustering, load balancing, and container orchestration (e.g., Kubernetes) in Node.js deployment? ###
  - **Clustering:** Multiple Node.js processes on one machine, sharing the same port (Node.js cluster module).
  - **Load Balancing:** Distributes traffic across multiple servers or processes.
  - **Container Orchestration:** Manages deployment, scaling, and health of containers (e.g., Docker, Kubernetes).
 **Example:**
  ```js
  // Clustering
  const cluster = require('cluster');
  if (cluster.isMaster) {
    for (let i = 0; i < 4; i++) cluster.fork();
  } else {
    require('./app');
  }
  ```



---
### Security

### How do you handle and validate incoming user data securely in Node.js? ###
  - Use validation libraries (e.g., `express-validator`, `joi`).
  - Sanitize input to prevent XSS and injection attacks.
  
   **Example:**
  ```js
  const { body, validationResult } = require('express-validator');
  app.post('/user',
    body('email').isEmail(),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      res.send('Valid!');
    });
  ```

### Explain the risks of prototype pollution in Node.js and how to mitigate them. ###
  - Prototype pollution allows attackers to modify object prototypes, potentially changing app behavior or causing security issues.
  - Prevent by validating and sanitizing input, and using libraries that guard against it.
  **Example:**
  ```js
  // Avoid merging user input directly into objects
  Object.assign({}, userInput); // Safe if userInput is plain object
  ```

### What are the best practices for securing REST APIs in Node.js? ###
  - Use HTTPS, validate/sanitize input, implement authentication/authorization, set security headers (Helmet), and rate limit requests.
 **Example:**
  ```js
  const helmet = require('helmet');
  app.use(helmet());
  ```

### How would you implement OAuth2 or JWT-based authentication in a Node.js API? ###
  - Use libraries like `passport`, `jsonwebtoken`, or `oauth2orize`.
  - Issue JWTs on login, verify them on protected routes.

  **Example:**
    ```js
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: 1 }, 'secret');
    jwt.verify(token, 'secret');
    ```

### What tools and techniques do you use to scan for vulnerabilities in Node.js dependencies? ###
  - Use `npm audit`, `snyk`, or `nsp` to scan for known vulnerabilities.
  - Keep dependencies updated and monitor advisories.
 **Example:**
  ```bash
  npm audit
  snyk test
  ```


---
### 🛠️ DevOps, CI/CD, and Production Readiness

### How do you implement graceful shutdowns in a Node.js microservice? ###
  - Listen for `SIGINT`/`SIGTERM` signals, close servers/connections, and exit after cleanup.
  - **Example:**
    ```js
    const server = app.listen(3000);
    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
    });
    ```

### What is the difference between SIGINT and SIGTERM in Node.js, and how should you handle them? ###
  - `SIGINT` is sent by Ctrl+C in the terminal; `SIGTERM` is sent by the OS/process manager.
  - Handle both to ensure graceful shutdown.
  - **Example:**
    ```js
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    function shutdown(signal) {
      console.log(`${signal} received. Exiting...`);
      process.exit(0);
    }
    ```

### What tools do you use to monitor a Node.js app in production (e.g., APM, logs, metrics)? ###
  - Use APMs (New Relic, Datadog), logging (Winston, Pino), metrics (Prometheus), and process managers (pm2).
  - **Example:**
    ```js
    const winston = require('winston');
    const logger = winston.createLogger({ transports: [new winston.transports.Console()] });
    logger.info('App started');
    ```

### How do you deploy Node.js applications using Docker and Kubernetes? ###
  - Use a Dockerfile to containerize the app, then deploy with Kubernetes manifests.
  - **Example:**
    ```dockerfile
    # Dockerfile
    FROM node:20
    WORKDIR /app
    COPY . .
    RUN npm install
    CMD ["node", "index.js"]
    ```

### What are your strategies for rolling updates or zero-downtime deployments in Node.js? ###
  - Use process managers (pm2 reload), blue-green/canary deployments, and Kubernetes rolling updates.
  - **Example:**
    ```bash
    pm2 reload app
    # or with Kubernetes
    kubectl rollout restart deployment/my-app
    ```


---
### 🔁 Asynchronous Behavior & Patterns

### What is backpressure in Node.js streams, and how do you handle it? ###
  - Backpressure occurs when a writable stream can't keep up with a readable stream.
  - Handle by pausing the readable stream and resuming when the writable is ready.
  - **Example:**
    ```js
    readable.on('data', chunk => {
      if (!writable.write(chunk)) readable.pause();
    });
    writable.on('drain', () => readable.resume());
    ```

### How would you implement retry logic with exponential backoff in Node.js? ###
  - Retry failed operations after increasing delays.
  - **Example:**
    ```js
    function retry(fn, retries = 3, delay = 100) {
      return fn().catch(err => {
        if (retries <= 0) throw err;
        return new Promise(res => setTimeout(res, delay)).then(() => retry(fn, retries - 1, delay * 2));
      });
    }
    ```

### What are async iterators and generators, and how can they be used with streams? ###
  - Async iterators allow you to consume data from streams using `for await...of`.
  - **Example:**
    ```js
    async function readStream(stream) {
      for await (const chunk of stream) {
        console.log(chunk);
      }
    }
    ```

### How do you implement custom Promisified utilities that use callbacks internally? ###
  - Wrap callback-based functions in a Promise.
  - **Example:**
    ```js
    function promisify(fn) {
      return (...args) => new Promise((resolve, reject) => {
        fn(...args, (err, result) => err ? reject(err) : resolve(result));
      });
    }
    ```

### Explain the difference between await Promise.all() and await Promise.allSettled() in a real-world use case. ###
  - `Promise.all()` fails fast if any promise rejects; `Promise.allSettled()` waits for all to finish.
  - Use `allSettled` when you want results from all, even if some fail.
  - **Example:**
    ```js
    const results = await Promise.allSettled([
      fetch('url1'),
      fetch('url2'),
      fetch('url3')
    ]);
    results.forEach(r => console.log(r.status));
    ```


---
## 🧩 Architecture & Design Patterns

### How would you design a multi-tenant Node.js application? ###
  - Use a shared codebase with tenant-specific configs, databases, or schemas.
  - Isolate tenant data and logic.
  - **Example:**
    ```js
    // Pseudocode: select DB based on tenant
    app.use((req, res, next) => {
      req.db = getDbForTenant(req.headers['x-tenant-id']);
      next();
    });
    ```

### What’s the best way to implement feature flags in a Node.js codebase? ###
  - Use a config file, environment variables, or a feature flag service.
  - **Example:**
    ```js
    if (process.env.FEATURE_X_ENABLED === 'true') {
      // Run new feature
    }
    ```

### Explain the Circuit Breaker pattern and how you would implement it in a Node.js microservice. ###
  - Circuit breaker prevents repeated calls to a failing service.
  - Use libraries like `opossum` or implement your own state machine.
  - **Example:**
    ```js
    const CircuitBreaker = require('opossum');
    const breaker = new CircuitBreaker(fetchData);
    breaker.fallback(() => 'Fallback data');
    breaker.fire().then(console.log);
    ```

### How would you design a distributed rate limiter for APIs using Redis and Node.js? ###
  - Use Redis to store request counts per user/IP and expire keys.
  - **Example:**
    ```js
    // Pseudocode
    redis.incr(userId);
    redis.expire(userId, 60); // 1 minute window
    if (redis.get(userId) > 100) blockUser();
    ```

### What is the Repository Pattern, and how would you use it in a Node.js app with a database? ###
  - Repository pattern abstracts DB access behind a class/interface.
  - **Example:**
    ```js
    class UserRepository {
      async findById(id) { return db.query('SELECT * FROM users WHERE id=?', [id]); }
    }
    ```


---
## ⚡ Bonus: Real-World Case Study Questions

### You have a Node.js server handling 5K requests/sec. Suddenly, latency spikes. How do you troubleshoot it? ##3
  - Check server/resource metrics (CPU, memory, event loop delay).
  - Profile with `clinic.js` or APM.
  - Look for slow DB queries, blocking code, or external service delays.
  - **Example:**
    ```js
    setInterval(() => console.log('Event loop lag:', Date.now() - lastTick), 1000);
    let lastTick = Date.now();
    ```

### You need to send 100K emails from a Node.js app. How do you queue, retry, and monitor this process? ###
  - Use a job queue (Bull, Bee-Queue, or RabbitMQ).
  - Retry failed jobs with exponential backoff.
  - Monitor with dashboard or logs.
  - **Example:**
    ```js
    const Queue = require('bull');
    const emailQueue = new Queue('email');
    emailQueue.process(async (job) => sendEmail(job.data));
    emailQueue.add({ to: 'user@example.com' });
    ```

### How would you architect a real-time multiplayer game backend using Node.js? ###
  - Use WebSockets for real-time communication.
  - Scale with Redis pub/sub or message brokers.
  - Partition game state by room or shard.
  - **Example:**
    ```js
    const ws = require('ws');
    const server = new ws.Server({ port: 8080 });
    server.on('connection', socket => {
      socket.on('message', msg => broadcast(msg));
    });
    ```

### What are the trade-offs between using REST vs gRPC in a Node.js microservice architecture? ###
  - REST: Simple, human-readable, widely supported, but less efficient for binary data.
  - gRPC: Fast, strongly typed, supports streaming, but requires proto definitions and is less human-friendly.
  - **Example:**
    ```js
    // REST: Express route
    app.get('/users', (req, res) => res.json(users));
    // gRPC: Define service in .proto, implement in Node.js
    ```

### How would you implement a secure and scalable file upload service in Node.js (with AWS S3)? ###
  - Use `multer` for file uploads, stream files to S3, validate file types/sizes.
  - **Example:**
    ```js
    const multer = require('multer');
    const AWS = require('aws-sdk');
    const upload = multer();
    app.post('/upload', upload.single('file'), (req, res) => {
      const s3 = new AWS.S3();
      s3.upload({ Bucket: 'my-bucket', Key: req.file.originalname, Body: req.file.buffer },
        (err, data) => {
          if (err) return res.status(500).send(err);
          res.send(data);
        });
    });
    ```


### CommonJS vs ES Modules in Node.js ###

**Definition:**  
- **CommonJS** is the original module system in Node.js, using `require()` and `module.exports`.  
- **ES Modules (ESM)** use `import` and `export` syntax, following the ECMAScript standard.

**Key Differences:**
- CommonJS loads modules synchronously; ESM is asynchronous.
- CommonJS uses `require()`/`module.exports`; ESM uses `import`/`export`.
- ESM supports static analysis and tree-shaking.

**Examples:**

*CommonJS:*
```js
// math.js
module.exports.add = (a, b) => a + b;

// app.js
const math = require('./math');
console.log(math.add(2, 3));
```

*ES Modules:*
```js
// math.mjs
export function add(a, b) { return a + b; }

// app.mjs
import { add } from './math.mjs';
console.log(add(2, 3));
```

---

### Protecting Node.js Apps from SQL Injection ###

**Definition:**  
SQL injection is a security vulnerability where attackers inject malicious SQL into queries. Prevent it by never concatenating user input into SQL statements.

**How to Protect:**
- Use parameterized queries or ORM libraries.
- Validate and sanitize all user input.

**Example (using parameterized queries with `mysql2`):**
```js
const mysql = require('mysql2');
const conn = mysql.createConnection({ /* config */ });
const userId = req.body.userId;
conn.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
  // Safe from SQL injection
});
```

---

### Callback Hell and How to Avoid It ###

**Definition:**  
Callback hell refers to deeply nested callbacks, making code hard to read and maintain.

**How to Avoid:**
- Use named functions, Promises, or async/await.

**Example (callback hell):**
```js
fs.readFile('a.txt', (err, data) => {
  fs.readFile('b.txt', (err2, data2) => {
    fs.readFile('c.txt', (err3, data3) => {
      // Nested callbacks
    });
  });
});
```

**Example (using Promises):**
```js
const fs = require('fs').promises;
Promise.all([
  fs.readFile('a.txt'),
  fs.readFile('b.txt'),
  fs.readFile('c.txt')
]).then(([a, b, c]) => {
  // All files read
});
```

**Example (using async/await):**
```js
async function readFiles() {
  const a = await fs.readFile('a.txt');
  const b = await fs.readFile('b.txt');
  const c = await fs.readFile('c.txt');
}
```

---

### Promise vs Async/Await ###

**Definition:**  
- **Promise:** An object representing the eventual completion or failure of an async operation.
- **async/await:** Syntactic sugar over Promises for writing async code in a synchronous style.

**Example (Promise):**
```js
function fetchData() {
  return new Promise((resolve) => setTimeout(() => resolve('data'), 1000));
}
fetchData().then(data => console.log(data));
```

**Example (async/await):**
```js
async function main() {
  const data = await fetchData();
  console.log(data);
}
main();
```

---

### Core Modules in Node.js ###

**Definition:**  
Core modules are built-in Node.js modules that do not require installation.

**Examples:**
- `fs` (File System): File operations.
- `http`: HTTP server/client.
- `path`: File path utilities.
- `os`: Operating system info.
- `crypto`: Cryptography functions.

**Example:**
```js
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (!err) console.log(data);
});
```


### What are the advantages of using Node.js over traditional server-side technologies?

**Definition:**  
Node.js is a JavaScript runtime built on Chrome's V8 engine, designed for building scalable network applications.

**Advantages:**
- **Non-blocking I/O:** Handles many connections concurrently using event-driven, asynchronous I/O.
- **Single Language:** Enables full-stack JavaScript development (client and server).
- **Fast Execution:** Uses the V8 engine for high performance.
- **Large Ecosystem:** npm provides access to thousands of open-source libraries.
- **Real-time Capabilities:** Well-suited for real-time apps (chat, games, collaboration).

**Example (simple HTTP server):**
```js
const http = require('http');
http.createServer((req, res) => {
  res.end('Hello from Node.js!');
}).listen(3000);
```

---

### How does Node.js implement module caching?

**Definition:**  
When a module is required for the first time, Node.js loads and executes it, then caches the exported object. Subsequent `require()` calls return the cached object, improving performance and ensuring singleton behavior.

**Example:**
```js
// counter.js
let count = 0;
module.exports = () => ++count;

// app.js
const counter = require('./counter');
console.log(counter()); // 1
console.log(counter()); // 2 (same instance due to caching)
```

---

### What is the difference between `exports` and `module.exports`?

**Definition:**  
- `module.exports` is the actual object returned by `require()`.
- `exports` is a shorthand reference to `module.exports`.  
If you assign a new value to `exports`, it breaks the reference.

**Example:**
```js
// Correct usage
module.exports = function() { return 'Hello'; };

// Incorrect usage (does not export the function)
exports = function() { return 'Hello'; };
```

---

### Explain the difference between Buffer and ArrayBuffer.

**Definition:**  
- **Buffer:** Node.js class for handling binary data directly, especially for file and network I/O.
- **ArrayBuffer:** Standard JavaScript object for representing generic, fixed-length binary data (used in browsers and Node.js).

**Example (Buffer):**
```js
const buf = Buffer.from('hello');
console.log(buf); // <Buffer 68 65 6c 6c 6f>
```

**Example (ArrayBuffer):**
```js
const ab = new ArrayBuffer(4);
const view = new Uint8Array(ab);
view[0] = 42;
console.log(view); // Uint8Array [ 42, 0, 0, 0 ]
```

---

### How do you implement caching in Node.js?

**Definition:**  
Caching stores frequently accessed data in memory or external stores to reduce computation or database load.

**Example (in-memory cache):**
```js
const cache = {};
function getData(key) {
  if (cache[key]) return cache[key];
  // Simulate expensive operation
  const value = computeExpensiveValue(key);
  cache[key] = value;
  return value;
}
```

**Example (using Redis):**
```js
const redis = require('redis');
const client = redis.createClient();
client.get('mykey', (err, value) => {
  if (value) {
    // Use cached value
  } else {
    // Fetch, then cache
    client.set('mykey', 'someValue');
  }
});
```
