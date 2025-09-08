# Node.js TypeScript Project: Middleware, EventEmitter, Buffer, Streams, Unit & E2E Tests


This project demonstrates the following Node.js concepts using TypeScript:
- Middleware (Express logger)
- EventEmitter (custom events, notifications)
- Buffer (encoding/decoding data)
- Streams (transforming and piping data)
- File upload (real-world use case)
- Unit tests (Jest)
- E2E tests (Supertest)


## Getting Started

1. Install dependencies:
   ```sh
   npm install
   npm install multer @types/multer --save
   npm install --save-dev @types/node
   ```
2. Build the project:
   ```sh
   npm run build
   ```
3. Run tests:
   ```sh
   npm test
   ```
4. Start the server:
   ```sh
   npm start
   ```
### Swagger API Documentation

- `GET /swagger` — Serves the OpenAPI (Swagger) documentation for all endpoints.

You can view the interactive API docs at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Project Structure
- `src/` - Source code (Express app, middleware, events, buffer, streams, file upload)
- `tests/` - Unit and E2E tests


## Scripts
- `npm run build` - Compile TypeScript
- `npm test` - Run all tests
- `npm start` - Start the server


---

## API Endpoints

### Middleware
- All requests are logged to the console.

### Buffer
- `GET /buffer` — Returns a UTF-8 string from a Buffer.
- `POST /buffer` — Accepts JSON `{ data: string }`, returns base64 and length.

### Streams
- `GET /stream` — Returns an uppercased string using streams.
- `POST /stream` — Echoes back streamed request data.

### EventEmitter
- `GET /event` — Emits and listens for a 'ping' event, returns `{ event, message }`.

### Real-World Example: File Upload & Notification
- `POST /upload` — Upload a file (form field: `file`). Emits a notification event.
- `GET /notify-upload` — Waits for a file upload event and responds with the filename.

---

## Example Usage

### File Upload
```sh
curl -F "file=@yourfile.txt" http://localhost:3000/upload
```

### Wait for Upload Notification
```sh
curl http://localhost:3000/notify-upload
```

### Buffer Example
```sh
curl -X POST http://localhost:3000/buffer -H "Content-Type: application/json" -d '{"data":"Hello"}'
```

### Stream Example
```sh
curl -X POST http://localhost:3000/stream --data "streaming data"
```


---

