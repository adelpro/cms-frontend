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

// Mock assets data
const assets = [
  {
    id: 1,
    title: "Quran Uthmani",
    description: "Quran Uthmani Description Summary",
    thumbnail_url: "https://cdn.example.com/thumbnails/asset-1.jpg",
    category: "mushaf",
    license: {
      code: "cc0",
      name: "CC0 - Public Domain"
    },
    publisher: {
      id: 1,
      name: "Tafsir Center",
      thumbnail_url: "https://cdn.example.com/publishers/publisher-1.jpg",
      bio: "Dedicated to preserving Quranic texts",
      verified: true
    },
    has_access: false,
    download_count: 1250,
    file_size: "2.5 MB"
  },
  {
    id: 2,
    title: "Tafsir Ibn Katheer",
    description: "Tafsir Ibn Katheer Description Summary",
    thumbnail_url: "https://cdn.example.com/thumbnails/asset-2.jpg",
    category: "tafsir",
    license: {
      code: "cc-by-4.0",
      name: "CC BY 4.0"
    },
    publisher: {
      id: 1,
      name: "Tafsir Center",
      thumbnail_url: "https://cdn.example.com/publishers/publisher-1.jpg",
      bio: "Dedicated to preserving Quranic texts",
      verified: true
    },
    has_access: true,
    download_count: 890,
    file_size: "15.2 MB"
  },
  {
    id: 3,
    title: "Quran Recitation - Mishary Rashid",
    description: "Beautiful recitation of the Holy Quran by Mishary Rashid Alafasy",
    thumbnail_url: "https://cdn.example.com/thumbnails/asset-3.jpg",
    category: "recitation",
    license: {
      code: "cc-by-nc-4.0",
      name: "CC BY-NC 4.0"
    },
    publisher: {
      id: 2,
      name: "Quran Audio Foundation",
      thumbnail_url: "https://cdn.example.com/publishers/publisher-2.jpg",
      bio: "Specialized in high-quality Quranic audio",
      verified: true
    },
    has_access: false,
    download_count: 2100,
    file_size: "45.8 MB"
  }
];

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
      
    }
    // Assets endpoints
    else if (path === '/mock-api/assets' && req.method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const query = parsedUrl.query;
      
      let filteredAssets = [...assets];
      
      // Apply category filter
      if (query.category) {
        filteredAssets = filteredAssets.filter(asset => asset.category === query.category);
      }
      
      // Apply license filter
      if (query.license_code) {
        filteredAssets = filteredAssets.filter(asset => asset.license.code === query.license_code);
      }
      
      // Set has_access based on authentication
      const assetsWithAccess = filteredAssets.map(asset => ({
        ...asset,
        has_access: token && tokens.has(token) ? asset.has_access : false
      }));
      
      res.writeHead(200);
      res.end(JSON.stringify({
        assets: assetsWithAccess
      }));
    }
    else if (path.startsWith('/mock-api/assets/') && req.method === 'GET') {
      const assetId = parseInt(path.split('/').pop());
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      const asset = assets.find(a => a.id === assetId);
      if (!asset) {
        res.writeHead(404);
        res.end(JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message: 'Asset not found'
          }
        }));
        return;
      }
      
      // Create detailed asset response
      const detailedAsset = {
        ...asset,
        snapshots: [
          {
            thumbnail_url: `https://cdn.example.com/snapshots/asset-${assetId}-1.jpg`,
            title: "لقطة من المحتوى ١",
            description: "كما هو مبين في اللقطة المرفقة ١ .. كلام"
          },
          {
            thumbnail_url: `https://cdn.example.com/snapshots/asset-${assetId}-2.jpg`,
            title: "لقطة من المحتوى ٢",
            description: "كما هو مبين في اللقطة المرفقة ٢ .. كلام"
          }
        ],
        resource: {
          id: assetId + 4,
          title: `${asset.title} Collection`,
          description: `Collection of ${asset.title} in various formats`
        },
        technical_details: {
          file_size: asset.file_size,
          format: "json",
          encoding: "UTF-8",
          version: "1.0.0",
          language: "ar"
        },
        stats: {
          download_count: asset.download_count,
          view_count: asset.download_count * 3,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-20T14:20:00Z"
        },
        access: {
          has_access: token && tokens.has(token) ? asset.has_access : false
        }
      };
      
      res.writeHead(200);
      res.end(JSON.stringify({
        asset: detailedAsset
      }));
    }
    else if (path.startsWith('/mock-api/assets/') && path.endsWith('/request-access') && req.method === 'POST') {
      const assetId = parseInt(path.split('/')[3]);
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || !tokens.has(token)) {
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
        request_id: Math.floor(Math.random() * 1000) + 1,
        status: "approved",
        message: "Access request approved",
        download_url: `/assets/${assetId}/download`
      }));
    }
    else if (path.startsWith('/mock-api/assets/') && path.endsWith('/download') && req.method === 'GET') {
      const assetId = parseInt(path.split('/')[3]);
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || !tokens.has(token)) {
        res.writeHead(401);
        res.end(JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token'
          }
        }));
        return;
      }
      
      const asset = assets.find(a => a.id === assetId);
      if (!asset) {
        res.writeHead(404);
        res.end(JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message: 'Asset not found'
          }
        }));
        return;
      }
      
      // Simulate file download
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${asset.title}.zip"`);
      res.writeHead(200);
      res.end('Mock file content for download');
    }
    else {
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
  console.log('  GET  /mock-api/assets');
  console.log('  GET  /mock-api/assets/{id}');
  console.log('  POST /mock-api/assets/{id}/request-access');
  console.log('  GET  /mock-api/assets/{id}/download');
});
