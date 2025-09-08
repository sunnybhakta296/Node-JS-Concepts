## Node.js Architecture Summary Diagram

Below is a visual summary of the Node.js architecture, showing how V8, Node libraries, libuv, thread pool, event queues, and the event loop work together:

![Node.js Architecture Diagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wnIEgP1gNEnNh4-tzR7QNA.png)

**Legend:**
- JavaScript code runs on the V8 engine (memory heap, call stack)
- Node.js libraries provide APIs (fs, http, net, timers, dns)
- libuv handles async I/O and manages the thread pool
- Event queues (microtask, macrotask) store callbacks
- The event loop coordinates execution between the stack and queues

For more details, see the [official Node.js event loop guide](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/).

---
## V8 Engine
The V8 engine is the JavaScript engine that runs your code in Node.js. It converts JavaScript into fast machine code.

- **Memory Heap:** This is where all variables, objects, and functions are stored in memory.
    ```js
    // Example: Creating objects in the heap
    const user = { name: 'Sunny' };
    ```
- **Call Stack:** This keeps track of which function is running. When a function is called, it goes on the stack; when it finishes, it is removed.
    ```js
    function greet() { console.log('Hello'); }
    greet(); // 'greet' is pushed to the stack, then popped off
    ```

## Node.js Library
Node.js provides built-in modules to work with files, servers, networking, timers, and DNS.

- **fs:** File system operations (read/write files)
    ```js
    const fs = require('fs');
    fs.readFile('file.txt', 'utf8', (err, data) => {
        if (!err) console.log(data);
    });
    ```
- **http:** Create web servers
    ```js
    const http = require('http');
    http.createServer((req, res) => res.end('Hello')).listen(3000);
    ```
- **net:** TCP servers and clients
    ```js
    const net = require('net');
    net.createServer(socket => socket.end('Bye')).listen(4000);
    ```
- **timers:** Schedule code to run later
    ```js
    setTimeout(() => console.log('Timeout!'), 1000);
    ```
- **dns:** Domain name lookups
    ```js
    const dns = require('dns');
    dns.lookup('nodejs.org', (err, address) => {
        if (!err) console.log(address);
    });
    ```


## Libuv & Thread Pool
Libuv is a C library that gives Node.js its event-driven, non-blocking abilities. It manages the thread pool for async tasks like file I/O.

- **Thread Pool:** Handles heavy or blocking tasks in the background so the main thread stays fast.
    ```js
    const crypto = require('crypto');
    crypto.pbkdf2('pass', 'salt', 100000, 64, 'sha512', () => {
        console.log('Done in thread pool');
    });
    ```


## Event Queue
The event queue stores callbacks waiting to run. There are two main types:
- **Microtask queue:** For promises and process.nextTick.
    ```js
    Promise.resolve().then(() => console.log('Microtask'));
    process.nextTick(() => console.log('Next tick'));
    ```
- **Macrotask queue:** For timers, I/O, setImmediate.
    ```js
    setTimeout(() => console.log('Macrotask'), 0);
    setImmediate(() => console.log('Immediate'));
    ```
    ### Microtask Queue vs Macrotask Queue

    | Feature         | Microtask Queue                                         | Macrotask Queue (aka Task Queue)                |
    |-----------------|--------------------------------------------------------|-------------------------------------------------|
    | **When it runs**| Immediately after the current operation and before the next event loop tick | In the next phase of the event loop             |
    | **Priority**    | Higher — runs before macrotasks                        | Lower — runs after all microtasks finish        |
    | **Examples**    | - `Promise.then()` / `.catch()` / `.finally()`<br>- `queueMicrotask()`<br>- `process.nextTick()` (Node.js only) | - `setTimeout()`<br>- `setInterval()`<br>- `setImmediate()` (Node.js)<br>- I/O callbacks |
    | **Use case**    | Small tasks that should run immediately after the current task finishes | Scheduled or delayed operations, I/O handling   |
   


## Event Loop
The event loop checks the queues and runs callbacks when the call stack is empty. It has phases for timers, I/O, and more.

### Event Loop Phases (with Simple Explanation & Code)

The Node.js event loop runs in several phases, each handling different types of callbacks:

1. **Timers (setTimeout, setInterval)**  
    Executes callbacks scheduled by `setTimeout` and `setInterval`.
    ```js
    setTimeout(() => console.log('Timer phase'), 0);
    setInterval(() => console.log('Interval phase'), 1000);
    ```

2. **Pending callbacks**  
    Handles I/O callbacks deferred to the next loop iteration (rarely used directly).
    ```js
    // Example: Some TCP errors or certain system operations trigger this phase.
    ```

3. **Idle, prepare**  
    Internal phase for Node.js, not used in user code.
    ```js
    // No direct user code runs here.
    ```

4. **Poll (I/O)**  
    Retrieves new I/O events and executes their callbacks (like reading files or network data).
    ```js
    const fs = require('fs');
    fs.readFile('file.txt', () => console.log('Poll phase (I/O callback)'));
    ```

5. **Check (setImmediate)**  
    Runs callbacks scheduled by `setImmediate`.
    ```js
    setImmediate(() => console.log('Check phase (setImmediate)'));
    ```

6. **Close callbacks**  
    Executes close event callbacks, e.g., for sockets.
    ```js
    const net = require('net');
    const server = net.createServer().listen(0, () => server.close());
    server.on('close', () => console.log('Close callbacks phase'));
    ```

**Summary:**  
Each phase processes specific types of callbacks. Timers and I/O callbacks are handled in their respective phases, while microtasks (like Promises and `process.nextTick`) always run between phases, before the event loop continues.

    ```js
    setTimeout(() => console.log('Timer'), 0);
    setImmediate(() => console.log('Immediate'));
    Promise.resolve().then(() => console.log('Promise'));
    process.nextTick(() => console.log('NextTick'));
    // Output: NextTick, Promise, Timer, Immediate (Timer/Immediate order may vary)
    ```

---
**Summary:**
Node.js architecture is built on the V8 engine, Node libraries, libuv (with thread pool), event queues, and the event loop. This lets Node.js handle many tasks at once, efficiently and fast!


```
┌──────────────┐
│ Script Start │
└──────┬───────┘
    │
    ▼
┌────────────────────┐
│ Synchronous Code   │
└──────┬─────────────┘
    │
    ▼
┌────────────────────┐
│ Async Offload      │  (Timers, fs, net, etc. go to Node APIs/libuv)
└──────┬─────────────┘
    │
    ▼
┌────────────────────┐
│ Call Stack Empty   │
└──────┬─────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Microtasks Queue            │  (process.nextTick, Promises)
└──────┬───────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Event Loop Phases           │  (Timers, Poll, Check, etc.)
└──────┬───────────────────────┘
    │
    ▼
┌────────────────────┐
│ Callback Execution │
└──────┬─────────────┘
    │
    ▼
┌──────────────┐
│   Repeat     │
└──────────────┘
```

**How to read:**
- Code starts in the script, runs synchronously, and offloads async work.
- When the call stack is empty, microtasks run first, then the event loop phases process callbacks.
- This cycle repeats, allowing Node.js to handle many tasks efficiently.

## `process.nextTick` vs `setImmediate`

Both `process.nextTick` and `setImmediate` schedule callbacks to run asynchronously, but they differ in *when* they execute in the Node.js event loop.

| Feature                | `process.nextTick`                                 | `setImmediate`                        |
|------------------------|---------------------------------------------------|---------------------------------------|
| **When it runs**       | After the current operation, *before* the event loop continues (before I/O, timers, etc.) | On the "check" phase of the event loop, *after* I/O events |
| **Priority**           | Highest — runs before any I/O or timer callbacks  | Lower — runs after I/O and timer callbacks |
| **Use case**           | Deferring work to run immediately after the current function, before any I/O | Scheduling work to run after I/O events and timers |
| **Example**            | `process.nextTick(() => console.log('nextTick'))` | `setImmediate(() => console.log('immediate'))` |

**Example:**
```js
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
console.log('main');
// Output:
// main
// nextTick
// setImmediate
```

**Summary:**  
- Use `process.nextTick` for microtasks that must run before any I/O or timer callbacks.
- Use `setImmediate` to schedule callbacks after I/O events, at the end of the current event loop phase.
- Avoid recursive or heavy use of `process.nextTick`, as it can starve the event loop and delay I/O.


## End-to-End Flow of Node.js Event Loop

1. **Script Start:**  
	Node.js loads and starts executing your JavaScript file from top to bottom.

2. **Synchronous Execution:**  
	All synchronous code runs first, line by line, on the call stack.

3. **Async Operations Offloaded:**  
	When Node.js encounters asynchronous APIs (like `setTimeout`, `fs.readFile`, Promises), it offloads them to libuv or V8, depending on the type.

4. **Call Stack Empties:**  
	Once all synchronous code is done, the call stack is empty.

5. **Microtasks Run:**  
	Node.js processes all microtasks (`process.nextTick`, Promises) before moving to the next event loop phase.

6. **Macrotask (Task/Event) Queue:**  
	Macrotasks (such as callbacks from `setTimeout`, `setInterval`, I/O events, and `setImmediate`) are stored in the macrotask queue. After all microtasks are processed, the event loop picks the next macrotask from this queue and executes its callback.

7. **Event Loop Phases:**  
	The event loop enters its phases (Timers, Pending Callbacks, Poll, Check, Close Callbacks), processing callbacks from the appropriate queues.

8. **Callback Execution:**  
	When an async operation completes, its callback is queued (as a macrotask or microtask) and executed in the correct phase.

9. **Repeat:**  
	Steps 5–8 repeat until there are no more tasks, timers, or I/O operations left.

**Note:**  
- The macrotask queue is sometimes called the "event queue" or "task queue." Microtasks always run before the next macrotask is processed.
- Understanding the distinction between microtasks and macrotasks is crucial for predicting callback execution order in Node.js.

**Summary Diagram:**

```
Script Start → Synchronous Code → Async Offload → Call Stack Empty
		  ↓
	Microtasks (nextTick, Promises)
		  ↓
	Event Loop Phases (Timers, Poll, etc.)
		  ↓
	Callback Execution
		  ↓
	Repeat until done
```

**Key Point:**  
Synchronous code always runs first, microtasks are prioritized before event loop phases, and async callbacks are handled efficiently by the event loop and libuv.

**Interview Tip:**  
Node.js knows which operations are async by their API design. If an API uses callbacks or returns a Promise, it's async and handled by libuv or the V8 microtask queue; otherwise, it's sync and runs on the call stack.
