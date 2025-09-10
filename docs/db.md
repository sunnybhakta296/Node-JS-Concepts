## Connecting to Databases in Node.js

### MongoDB Example (using `mongoose`)

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
```

### PostgreSQL Example (using `pg`)

```js
const { Client } = require('pg');

const client = new Client({
    user: 'youruser',
    host: 'localhost',
    database: 'mydb',
    password: 'yourpassword',
    port: 5432,
});

client.connect()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.error('PostgreSQL connection error:', err));
```


**ORM (Object-Relational Mapping):**
ORMs are libraries that map objects in code to relational database tables, allowing developers to interact with databases using object-oriented syntax instead of SQL.

**ODM (Object-Document Mapping):**
ODMs are similar to ORMs but are used for document-based (NoSQL) databases, mapping objects in code to documents in databases like MongoDB.

**Popular ORMs in Node.js:**
- Sequelize (for SQL databases)
- TypeORM (for SQL databases)
- Objection.js (for SQL databases)

**Popular ODMs in Node.js:**
- Mongoose (for MongoDB)
- Typegoose (wrapper for Mongoose)
- Waterline (supports both SQL and NoSQL)


### What is Connection Pooling?

- Connection pooling is a technique for efficiently managing and reusing database connections.
- Instead of opening and closing a new connection for every operation, a pool of connections is maintained.
- When a database operation is needed, a connection is borrowed from the pool and returned after use.
- This approach improves performance and reduces latency.
- Connection pooling helps manage database resources effectively, especially in high-concurrency applications.

### Example: Using Connection Pooling with MySQL (`mysql2`)

```js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'youruser',
    password: 'yourpassword',
    database: 'mydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
        return console.error('MySQL query error:', err);
    }
    console.log('User rows:', results);
});
```
### Example: Using Connection Pooling with MongoDB (`mongoose`)

Mongoose manages its own internal connection pool by default. You can configure the pool size using the `poolSize` option:

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10 // Set the maximum number of sockets the MongoDB driver will keep open for this connection
})
.then(() => console.log('MongoDB connected with connection pooling'))
.catch(err => console.error('MongoDB connection error:', err));
```

- The `poolSize` option controls how many concurrent operations can be handled by the connection pool.
- Mongoose and the underlying MongoDB driver handle connection reuse automatically.
- Connection pooling is especially useful for applications with high concurrency.


