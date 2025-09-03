/**
 * Simple Mock API Server for Testing
 * Run with: node mock-server.js
 */

const http = require('http');
const url = require('url');

// Mock data
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    email_verified: true,
    profile_completed: true,
    auth_provider: 'email'
  }
];

const tokens = new Map();

// Generate JWT-like tokens
function generateToken() {
  return 'mock_jwt_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Parse request body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

// Create server
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  try {
    if (path === '/mock-api/auth/register' && req.method === 'POST') {
      const body = await parseBody(req);
      
      // Check if email already exists
      if (users.find(u => u.email === body.email)) {
        res.writeHead(409);
        res.end(JSON.stringify({
          error: {
            code: 'EMAIL_TAKEN',
            message: 'Email already exists'
          }
        }));
        return;
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        email: body.email,
        password: body.password,
        name: body.name,
        email_verified: false,
        profile_completed: false,
        auth_provider: 'email'
      };
      
      users.push(newUser);
      
      const access_token = generateToken();
      const refresh_token = generateToken();
      
      res.writeHead(201);
      res.end(JSON.stringify({
        access_token,
        refresh_token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          email_verified: newUser.email_verified,
          profile_completed: newUser.profile_completed,
          auth_provider: newUser.auth_provider
        }
      }));
      
    } else if (path === '/mock-api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      
      const user = users.find(u => u.email === body.email && u.password === body.password);
      
      if (!user) {
        res.writeHead(401);
        res.end(JSON.stringify({
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        }));
        return;
      }
      
      const access_token = generateToken();
      const refresh_token = generateToken();
      
      res.writeHead(200);
      res.end(JSON.stringify({
        access_token,
        refresh_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          email_verified: user.email_verified,
          profile_completed: user.profile_completed,
          auth_provider: user.auth_provider
        }
      }));
      
    } else if (path === '/mock-api/auth/profile' && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401);
        res.end(JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token'
          }
        }));
        return;
      }
      
      // For mock purposes, return the first user
      const user = users[0];
      
      res.writeHead(200);
      res.end(JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.email_verified,
        profile_completed: user.profile_completed,
        auth_provider: user.auth_provider
      }));
      
    } else if (path === '/mock-api/auth/profile' && req.method === 'PUT') {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401);
        res.end(JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token'
          }
        }));
        return;
      }
      
      const body = await parseBody(req);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        message: 'Profile updated successfully',
        profile: {
          id: 1,
          profile_completed: true
        }
      }));
      
    } else if (path === '/mock-api/auth/token/refresh' && req.method === 'POST') {
      const body = await parseBody(req);
      
      if (!body.refresh_token) {
        res.writeHead(400);
        res.end(JSON.stringify({
          error: {
            code: 'INVALID_REQUEST',
            message: 'Refresh token is required'
          }
        }));
        return;
      }
      
      const access_token = generateToken();
      
      res.writeHead(200);
      res.end(JSON.stringify({
        access_token
      }));
      
    } else if (path === '/mock-api/auth/logout' && req.method === 'POST') {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401);
        res.end(JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token'
          }
        }));
        return;
      }
      
      res.writeHead(204);
      res.end();
      
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found'
        }
      }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    }));
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /mock-api/auth/register');
  console.log('  POST /mock-api/auth/login');
  console.log('  GET  /mock-api/auth/profile');
  console.log('  PUT  /mock-api/auth/profile');
  console.log('  POST /mock-api/auth/token/refresh');
  console.log('  POST /mock-api/auth/logout');
});
