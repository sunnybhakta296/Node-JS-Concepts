// import app, { MyEmitter, bufferExample, streamExample } from '../src/index';
// import request from 'supertest';

// describe('Middleware, EventEmitter, Buffer, Streams', () => {
//   it('should log requests (middleware)', async () => {
//     // No assertion, just ensure route works
//     await request(app).get('/buffer');
//   });

//   it('should emit and listen to events (EventEmitter)', done => {
//     const emitter = new MyEmitter();
//     emitter.on('test', (msg) => {
//       expect(msg).toBe('hello');
//       done();
//     });
//     emitter.emit('test', 'hello');
//   });

//   it('should handle buffer correctly', () => {
//     expect(bufferExample()).toBe('Hello Buffer!');
//   });

//   it('should process streams correctly', async () => {
//     const result = await streamExample();
//     expect(result).toBe('NODEJS STREAMS');
//   });
// });

// describe('E2E: Express routes', () => {
//   it('GET /buffer returns buffer result', async () => {
//     const res = await request(app).get('/buffer');
//     expect(res.text).toBe('Hello Buffer!');
//   });

//   it('GET /stream returns stream result', async () => {
//     const res = await request(app).get('/stream');
//     expect(res.text).toBe('NODEJS STREAMS');
//   });
//   it('POST /buffer returns buffer from data', async () => {
//     const res = await request(app).post('/buffer').send({ data: 'test' });
//     expect(res.text).toBe(Buffer.from('test').toString('base64'));
//   });

//   it('POST /stream echoes streamed data', async () => {
//     const res = await request(app).post('/stream').send('hello');
//     expect(res.text).toBe('hello');
//   });

//   it('GET /event returns ping event', async () => {
//     const res = await request(app).get('/event');
//     expect(res.body).toHaveProperty('event', 'ping');
//     expect(res.body).toHaveProperty('message', 'pong!');
//   });

//   it('POST /upload uploads a file', async () => {
//     const res = await request(app)
//       .post('/upload')
//       .attach('file', Buffer.from('filecontent'), 'test.txt');
//     expect(res.body).toHaveProperty('filename', 'test.txt');
//     expect(res.body).toHaveProperty('size');
//   });

//   it('GET /notify-upload waits for file upload event', async () => {
//     // Simulate upload first
//     await request(app)
//       .post('/upload')
//       .attach('file', Buffer.from('filecontent'), 'notify.txt');
//     const res = await request(app).get('/notify-upload');
//     expect(res.body.message).toContain('File uploaded: notify.txt');
//   });

//   it('GET /threadpool returns threadpool result', async () => {
//     const res = await request(app).get('/threadpool?number=5');
//     expect(res.body).toHaveProperty('result');
//   });

//   it('POST /v8/serialize serializes object', async () => {
//     const res = await request(app).post('/v8/serialize').send({ foo: 'bar' });
//     expect(res.body).toHaveProperty('serialized');
//   });

//   it('POST /v8/deserialize deserializes object', async () => {
//     const ser = Buffer.from(JSON.stringify({ foo: 'bar' })).toString('base64');
//     const res = await request(app).post('/v8/deserialize').send({ serialized: ser });
//     expect(res.body).toHaveProperty('deserialized');
//   });

//   it('GET /v8/heap returns heap stats', async () => {
//     const res = await request(app).get('/v8/heap');
//     expect(res.body).toBeDefined();
//   });

//   it('GET /process/info returns process info', async () => {
//     const res = await request(app).get('/process/info');
//     expect(res.body).toHaveProperty('pid');
//   });

//   it('GET /process/memory returns memory usage', async () => {
//     const res = await request(app).get('/process/memory');
//     expect(res.body).toHaveProperty('rss');
//   });

//   it('POST /child/exec runs shell command', async () => {
//     const res = await request(app).post('/child/exec').send({ command: 'echo hello' });
//     expect(res.body).toHaveProperty('stdout');
//   });

//   it('POST /child/spawn spawns script', async () => {
//     const res = await request(app).post('/child/spawn').send({ scriptPath: './src/features/script.js', args: [] });
//     expect(res.body).toHaveProperty('output');
//   });

//   it('POST /child/fork forks script', async () => {
//     const res = await request(app).post('/child/fork').send({ scriptPath: './src/features/childScript.js', args: [], message: { test: true } });
//     expect(res.body).toHaveProperty('output');
//   });

//   it('POST /pipe/uppercase transforms text', async () => {
//     const res = await request(app).post('/pipe/uppercase').send({ text: 'hello' });
//     expect(res.body.result).toBe('HELLO');
//   });

//   it('POST /pipe/backpressure handles backpressure', async () => {
//     const res = await request(app).post('/pipe/backpressure').send({ text: 'hello', chunkSize: 2 });
//     expect(res.body).toBeDefined();
//   });

//   it('GET /cluster/info returns cluster info', async () => {
//     const res = await request(app).get('/cluster/info');
//     expect(res.body).toHaveProperty('isPrimary');
//     expect(res.body).toHaveProperty('pid');
//   });
// });
