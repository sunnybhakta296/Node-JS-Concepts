## Libuv
**Definition:**  
Libuv is a multi-platform C library that provides Node.js with an event-driven, asynchronous I/O model. It abstracts non-blocking operations such as file system access, networking, timers, and child processes, enabling Node.js to perform high-performance I/O without blocking the main thread. Libuv implements the event loop and thread pool that power Node.js's concurrency model.

**Key Features:**
- Cross-platform support (Windows, Unix, macOS)
- Event loop for scheduling asynchronous operations
- Thread pool for handling file I/O, DNS, crypto, and other tasks
- Asynchronous TCP/UDP sockets and pipes

**Example (conceptual):**
```javascript
// Node.js uses libuv under the hood for async I/O
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data); // This runs asynchronously via libuv's thread pool
});
```

---

## HTTP/2 Support in Node.js

**Definition:**  
Node.js has built-in support for HTTP/2, which enables multiplexing, header compression, and improved performance over HTTP/1.1. The `http2` module allows you to create HTTP/2 servers and clients.

**Example:**
```javascript
const http2 = require('http2');
const fs = require('fs');
const server = http2.createSecureServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
});
server.on('stream', (stream, headers) => {
  stream.respond({ ':status': 200 });
  stream.end('Hello over HTTP/2!');
});
server.listen(8443);
```

---

## Multiplexing in HTTP/2

**Definition:**  
Multiplexing is a key feature of HTTP/2 that allows multiple requests and responses to be sent simultaneously over a single TCP connection. Unlike HTTP/1.1, where each request/response pair requires its own connection or must wait for others to finish (head-of-line blocking), HTTP/2 multiplexing enables concurrent streams, improving performance and resource utilization.

**How it works:**  
Each HTTP/2 connection can have multiple independent streams, each identified by a unique stream ID. Data frames from different streams are interleaved on the wire and reassembled by the receiver, so multiple resources (HTML, CSS, JS, images) can be loaded in parallel without waiting for others to complete.

**Example (Node.js HTTP/2 server with multiplexing):**
```javascript
const http2 = require('http2');
const fs = require('fs');
const server = http2.createSecureServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
});
server.on('stream', (stream, headers) => {
  // Simulate different resources based on path
  if (headers[':path'] === '/style.css') {
    stream.respond({ 'content-type': 'text/css', ':status': 200 });
    stream.end('body { color: blue; }');
  } else if (headers[':path'] === '/script.js') {
    stream.respond({ 'content-type': 'application/javascript', ':status': 200 });
    stream.end('console.log("Loaded JS");');
  } else {
    stream.respond({ 'content-type': 'text/html', ':status': 200 });
    stream.end('<html><head><link rel="stylesheet" href="/style.css"><script src="/script.js"></script></head><body>Hello Multiplexing!</body></html>');
  }
});
server.listen(8443);
```

**How to test:**
- Open a browser or use a tool like curl with HTTP/2 support to request the HTML page. The browser will request `/style.css` and `/script.js` in parallel over the same connection, demonstrating multiplexing.

**Interview Tip:**
- Multiplexing reduces latency and improves page load times by eliminating head-of-line blocking present in HTTP/1.1.

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

