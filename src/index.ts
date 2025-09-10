import cluster from 'cluster';
import { startClusteredServer } from './features/clusterExample';
import { manualBackpressure } from './features/pipingExample';
import { pipeToUppercase } from './features/pipingExample';
import { runShellCommand, spawnNodeScript, forkNodeScript } from './features/childProcessExample';
import { getProcessInfo, getMemoryUsage } from './features/processExample';
import { v8SerializeExample, v8DeserializeExample, v8HeapStats } from './features/v8Example';
import { runInThreadPool } from './features/threadPool';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { loggerMiddleware } from './features/middleware';
import { encryptObject } from './features/cryptoUtils';
import { emitFileUploaded, onFileUploadedOnce, emitPing, onPingOnce } from './features/eventEmitter';
import { bufferExample, bufferFromData } from './features/buffer';
import { streamExample } from './features/streams';
import { upload } from './features/upload';

import { setupSwagger } from './features/swagger';


const app = express();
setupSwagger(app);

// Middleware for logging requests
app.use(loggerMiddleware);
// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Buffer endpoints
 */

// GET /buffer - Returns a buffer example
app.get('/buffer', (_req: Request, res: Response) => {
    res.send(bufferExample());
});

// POST /buffer - Creates a buffer from posted data
app.post('/buffer', (req: Request, res: Response) => {
    const { data } = req.body;
    if (!data) return res.status(400).send('Missing data');
    res.send(bufferFromData(data));
});

/**
 * Streams endpoints
 */

// GET /stream - Returns a stream example result
app.get('/stream', async (_req: Request, res: Response) => {
    const result = await streamExample();
    res.send(result);
});

// POST /stream - Pipes request body to response
app.post('/stream', (req: Request, res: Response) => {
    req.pipe(res);
});

/**
 * EventEmitter endpoints
 */

// GET /event - Emits and listens for a 'ping' event
app.get('/event', (_req: Request, res: Response) => {
    onPingOnce((msg: string) => {
        res.send({ event: 'ping', message: msg });
    });
    emitPing('pong!');
});

/**
 * File upload and notification endpoints
 */

// POST /upload - Handles file upload and emits 'fileUploaded' event
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    const file = (req as Request & { file: Express.Multer.File }).file;
    if (!file) return res.status(400).send('No file uploaded');
    emitFileUploaded(file.originalname);
    res.send({ filename: file.originalname, size: file.size });
});

// GET /notify-upload - Listens for 'fileUploaded' event and responds with filename
app.get('/notify-upload', (_req: Request, res: Response) => {
    onFileUploadedOnce((filename: string) => {
        res.send({ message: `File uploaded: ${filename}` });
    });
});

/**
 * Thread pool endpoint
 */

// GET /threadpool?number=5 - Runs a CPU-bound task in a worker thread
app.get('/threadpool', async (req: Request, res: Response) => {
    const number = parseInt(req.query.number as string) || 10;
    try {
        const result = await runInThreadPool({ number });
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * V8 JavaScript Engine endpoints
 */

// POST /v8/serialize - Serializes a JSON object using V8
app.post('/v8/serialize', (req: Request, res: Response) => {
    try {
        const buf = v8SerializeExample(req.body);
        res.send({ serialized: buf.toString('base64') });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// POST /v8/deserialize - Deserializes a base64 string using V8
app.post('/v8/deserialize', (req: Request, res: Response) => {
    try {
        const { serialized } = req.body;
        if (!serialized) return res.status(400).json({ error: 'Missing serialized data' });
        const buf = Buffer.from(serialized, 'base64');
        const obj = v8DeserializeExample(buf);
        res.send({ deserialized: obj });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// GET /v8/heap - Returns V8 heap statistics
app.get('/v8/heap', (_req: Request, res: Response) => {
    res.send(v8HeapStats());
});

/**
 * Process endpoints
 */

// GET /process/info - Returns current process information
app.get('/process/info', (_req: Request, res: Response) => {
    res.send(getProcessInfo());
});

// GET /process/memory - Returns current process memory usage
app.get('/process/memory', (_req: Request, res: Response) => {
    res.send(getMemoryUsage());
});

/**
 * Child Process endpoints
 */

// POST /child/exec - Runs a shell command and returns stdout/stderr
// stdout: Standard output stream (normal output from the command)
// stderr: Standard error stream (error output from the command)
// Body: { "command": "ls" }
app.post('/child/exec', async (req: Request, res: Response) => {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: 'Missing command' });
    try {
        const result = await runShellCommand(command);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /child/spawn - Spawns a Node.js script as a child process
// Body: { "scriptPath": "./script.js", "args": ["foo"] }
app.post('/child/spawn', async (req: Request, res: Response) => {
    const { scriptPath, args } = req.body;
    if (!scriptPath) return res.status(400).json({ error: 'Missing scriptPath' });
    try {
        const output = await spawnNodeScript(scriptPath, args || []);
        res.json({ output });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /child/fork - Forks a Node.js script and communicates via IPC
// Body: { "scriptPath": "./childScript.js", "args": [], "message": { ... } }
app.post('/child/fork', async (req: Request, res: Response) => {
    const { scriptPath, args, message } = req.body;
    if (!scriptPath) return res.status(400).json({ error: 'Missing scriptPath' });
    try {
        const output = await forkNodeScript(scriptPath, args || [], message);
        res.json({ output });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Piping Streams endpoint
 */

// POST /pipe/uppercase - Pipes input text through a transform stream to uppercase
// Body: { "text": "hello world" }
app.post('/pipe/uppercase', async (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });
    try {
        const result = await pipeToUppercase(text);
        res.json({ result });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Backpressure endpoint
 */
// POST /pipe/backpressure - Demonstrates manual backpressure handling
// Body: { "text": "your input string", "chunkSize": 2 }
app.post('/pipe/backpressure', async (req: Request, res: Response) => {
    const { text, chunkSize } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });
    try {
        const result = await manualBackpressure(text, chunkSize);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Cluster endpoint
 */

// GET /cluster/info - Shows if current process is primary or worker
app.get('/cluster/info', (_req: Request, res: Response) => {
    res.json({
        isPrimary: cluster.isPrimary,
        pid: process.pid,
        type: cluster.isPrimary ? 'primary' : 'worker'
    });
});


/**
 * Secure endpoint example: Validates and sanitizes request body
 */
app.post(
    '/secure-data',
    [
        body('email').isEmail().normalizeEmail(),
        body('age').isInt({ min: 0, max: 120 }).toInt(),
        body('name').trim().escape(),
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Encrypt the validated and sanitized request body
        const encrypted = encryptObject(req.body);
        res.json({ message: 'Request body is secure and encrypted!', encrypted });
    }
);

export default app;
