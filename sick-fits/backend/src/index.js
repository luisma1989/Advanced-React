const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');
const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());
// Use express middleware to populate current user
// Decode the jwtr so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // Put the userID on to the req for further request to access.
    req.userId = userId;
  }
  next();
});
// 2. Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  // If they arent logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId }},
    '{ id, permissions, email, name }'
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is running now on port http:/localhost/${deets.port}`);
  }
);
