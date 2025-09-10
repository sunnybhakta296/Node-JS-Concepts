## ✅ Step-by-Step: Encrypting Passwords on the Frontend (with RSA)
### 🧩 Dynamic Dropdown Filters from MongoDB (No Hardcoding)

Modern UIs often need filter dropdowns (e.g., color, size, price, location) that adapt automatically to your data. Here’s how to build a fully dynamic filter system—no hardcoded fields or values.

#### **How It Works (End-to-End Flow)**

| Step | What Happens | How to Implement |
|------|--------------|------------------|
| 1 | **Discover filter fields dynamically** | Query your collection to find which fields exist and should be filterable. Use `$objectToArray` in aggregation to extract field names, then filter out unwanted keys. |
| 2 | **Get distinct values & counts for each filter** | For each discovered field, aggregate the distinct values and their counts. Use MongoDB `$facet` + `$group` dynamically built for those fields. |
| 3 | **Return combined JSON** | Send a JSON object with keys = filter fields, values = arrays of `{ _id: value, count }` for frontend dropdowns. Example: `{ color: [...], size: [...], price: [...] }` |
| 4 | **Frontend builds dropdowns dynamically** | Build the filter UI based on keys and values from the response—no static code for filters or values. Map keys to dropdown labels and options. |

**Why is this powerful?**

- The filter system automatically adapts if you add new fields or values in your database.
- The frontend never needs a manual update for new filters or values.
- Users always see current filter options reflecting your latest data.

---

### 🛠️ Node.js Example: Dynamic Filter API

This example discovers filter fields and their values/counts from your MongoDB collection, returning a JSON object for dynamic dropdowns.

```js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URI and DB/Collection name
const uri = 'mongodb://localhost:27017';
const dbName = 'yourDB';
const collectionName = 'products';

// Step 1: Discover filter fields dynamically
async function getDynamicFilterFields(collection) {
    const pipeline = [
        { $project: { fields: { $objectToArray: "$$ROOT" } } },
        { $unwind: "$fields" },
        { $group: { _id: null, allFields: { $addToSet: "$fields.k" } } }
    ];
    const result = await collection.aggregate(pipeline).toArray();
    const allFields = result[0]?.allFields || [];
    // Exclude unwanted fields from filters
    const excludedFields = ['_id', 'createdAt', 'updatedAt', 'description', 'name'];
    return allFields.filter(f => !excludedFields.includes(f));
}

// Step 2: Build $facet stage for distinct values/counts
function buildFacetStage(fields) {
    const facet = {};
    fields.forEach(field => {
        facet[field] = [
            { $match: { [field]: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: `$${field}`, count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ];
    });
    return { $facet: facet };
}

// Step 3: API endpoint
async function main() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    app.get('/api/products/filters', async (req, res) => {
        try {
            const filterFields = await getDynamicFilterFields(collection);
            const pipeline = [buildFacetStage(filterFields)];
            const results = await collection.aggregate(pipeline).toArray();
            res.json(results[0] || {});
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

main().catch(console.error);
```

---

#### **How to Use**

1. Ensure MongoDB is running and your `products` collection has documents.
2. Adjust `uri`, `dbName`, and `collectionName` as needed.
3. Run the server.
4. Call: `GET http://localhost:3000/api/products/filters`
5. You’ll get a JSON response with all filter fields discovered dynamically, each containing an array of distinct values with counts.

**Example Response:**
```json
{
    "color": [
        { "_id": "red", "count": 120 },
        { "_id": "blue", "count": 80 }
    ],
    "size": [
        { "_id": "M", "count": 100 },
        { "_id": "L", "count": 60 }
    ],
    "price": [
        { "_id": 19.99, "count": 50 },
        { "_id": 29.99, "count": 30 }
    ]
}
```

---

## 🔐 Custom OAuth2 Implementation in Node.js

While libraries like Passport simplify OAuth2, you can also implement OAuth2 flows manually for learning or custom needs. Below is a basic example of the OAuth2 Authorization Code flow with Google, using only `express`, `axios`, and `express-session`.

### 1. Install Dependencies

```bash
npm install express axios express-session
```

### 2. Set Up OAuth2 Endpoints

```js
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));

const CLIENT_ID = 'GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

// Step 1: Redirect user to Google's OAuth2 consent page
app.get('/auth/google', (req, res) => {
    const params = querystring.stringify({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'profile email',
        access_type: 'offline',
        prompt: 'consent'
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Step 2: Handle OAuth2 callback and exchange code for tokens
app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send('No code provided');

    try {
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        req.session.tokens = tokenRes.data;
        res.redirect('/profile');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Step 3: Fetch user profile using access token
app.get('/profile', async (req, res) => {
    if (!req.session.tokens) return res.redirect('/auth/google');
    try {
        const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${req.session.tokens.access_token}` }
        });
        res.json(userRes.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

**Note:** Replace `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with your credentials.

---

## 🆚 OAuth2 vs JWT

| Feature                | OAuth2                                             | JWT (JSON Web Token)                        |
|------------------------|----------------------------------------------------|---------------------------------------------|
| **Purpose**            | Authorization protocol (delegated access)          | Token format for stateless authentication   |
| **How it works**       | Issues access tokens after user consent            | Encodes claims in a signed token            |
| **Token Storage**      | Typically opaque tokens (can be JWT)               | Always a self-contained JWT                 |
| **Use Case**           | Third-party access (e.g., login with Google)       | API authentication, session management      |
| **Revocation**         | Can be revoked at auth server                      | Harder to revoke (unless using a blacklist) |
| **Standard Flows**     | Authorization Code, Implicit, Client Credentials   | No flows; just token creation/validation    |
| **Example**            | "Allow app to access your Google Drive"            | "User logs in, gets a JWT for API access"   |

**Summary:**  
- **OAuth2** is a protocol for granting access to resources, often using tokens (which may be JWTs).
- **JWT** is a token format, often used for stateless authentication in APIs.
- They are complementary: OAuth2 can use JWTs as access tokens, but not all JWT usage involves OAuth2.

---

**References:**
- [Google OAuth2 Docs](https://developers.google.com/identity/protocols/oauth2)
- [JWT Introduction](https://jwt.io/introduction)


## 🛡️ Fully Dynamic Roles & Permissions (No Hardcoding)

You can build a truly dynamic roles and permissions system—no hardcoded roles or permissions in your code. Everything is managed in the database, so you can add or update roles and permissions at any time, without code changes or redeploys. Filter fields also remain fully dynamic, discovered from your data.

### **Key Principles**

- **Roles and permissions are stored in the database** (e.g., a `roles` collection).
- **Backend reads roles & permissions at runtime**—no hardcoded logic.
- **Add/update roles and permissions by editing DB documents** (no code update needed).
- **Filter fields are still discovered dynamically from your data.**

---

### **Design & Example Implementation**

#### 1. **Role & Permissions Storage**

Create a `roles` collection with documents like:

```json
{
    "role": "admin",
    "permissions": [
        "view_filters",
        "edit_products",
        "delete_products"
    ]
}
```
```json
{
    "role": "analyst",
    "permissions": [
        "view_filters"
    ]
}
```
```json
{
    "role": "user",
    "permissions": []
}
```

#### 2. **Users Store Their Roles**

A user can have multiple roles. Example JWT payload:

```json
{
    "username": "john_doe",
    "roles": ["analyst"]
}
```

#### 3. **Dynamic Middleware Logic**

- Middleware extracts user roles from the JWT.
- It queries the `roles` collection to get all permissions for those roles.
- Checks if the user has the required permission for the route (e.g., `view_filters`).
- **No roles or permissions are hardcoded in code.**

#### 4. **Full Example: Node.js + Express + MongoDB**

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017';
const dbName = 'yourDB';
const rolesCollectionName = 'roles';
const productsCollectionName = 'products';

const JWT_SECRET = 'your_jwt_secret_key';

// Get all permissions for a user's roles
async function getRolesPermissions(db, userRoles) {
    const rolesData = await db.collection(rolesCollectionName).find({
        role: { $in: userRoles }
    }).toArray();
    const permissionsSet = new Set();
    rolesData.forEach(roleDoc => {
        (roleDoc.permissions || []).forEach(p => permissionsSet.add(p));
    });
    return Array.from(permissionsSet);
}

// Middleware: authenticate and attach user info
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Middleware: check if user has required permission dynamically
function authorizePermission(requiredPermission, db) {
    return async (req, res, next) => {
        if (!req.user) return res.sendStatus(401);
        const userRoles = req.user.roles || [];
        const permissions = await getRolesPermissions(db, userRoles);
        if (!permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
}

// Discover filter fields dynamically
async function getDynamicFilterFields(collection) {
    const pipeline = [
        { $project: { fields: { $objectToArray: "$$ROOT" } } },
        { $unwind: "$fields" },
        { $group: { _id: null, allFields: { $addToSet: "$fields.k" } } }
    ];
    const result = await collection.aggregate(pipeline).toArray();
    const allFields = result[0]?.allFields || [];
    const excludedFields = ['_id', 'createdAt', 'updatedAt', 'description', 'name'];
    return allFields.filter(f => !excludedFields.includes(f));
}

// Build $facet stage for distinct values/counts
function buildFacetStage(fields) {
    const facet = {};
    fields.forEach(field => {
        facet[field] = [
            { $match: { [field]: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: `$${field}`, count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ];
    });
    return { $facet: facet };
}

async function main() {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const productsCollection = db.collection(productsCollectionName);

    // Protected route: only users with 'view_filters' permission can access
    app.get(
        '/api/products/filters',
        authenticateToken,
        authorizePermission('view_filters', db),
        async (req, res) => {
            try {
                const filterFields = await getDynamicFilterFields(productsCollection);
                const pipeline = [buildFacetStage(filterFields)];
                const results = await productsCollection.aggregate(pipeline).toArray();
                res.json(results[0] || {});
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        }
    );

    // Dummy login endpoint (for demo only)
    app.post('/login', express.json(), async (req, res) => {
        const { username } = req.body;
        // Dummy user-role mapping (replace with real user DB in production)
        const userRoleMap = {
            'adminUser': ['admin'],
            'analystUser': ['analyst'],
            'normalUser': ['user'],
        };
        const roles = userRoleMap[username];
        if (!roles) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ username, roles }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

main().catch(console.error);
```

---

### **Benefits**

- **Add/update roles and permissions by editing DB documents—no code change.**
- **Users can have multiple roles.**
- **Permissions (like `view_filters`) control API access.**
- **Filter fields and values remain dynamic, based on product data.**
- **Centralized, clean, and scalable RBAC system.**

---

**Want more?**  
I can help you add:
- Role management APIs (create/update/delete roles & permissions)
- User management with role assignments
- Frontend examples for dynamic filters & login

