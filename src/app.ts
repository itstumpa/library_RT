// src/app.ts

import express from 'express';
import apiRoutes from './routes/index';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Library E-commerce API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/',
      users: '/users',
      library: '/api/library/*',
      products: '/api/products/*'
    }
  });
});

// Keep your existing user routes
app.get('/users', async (req, res) => {
  const { prisma } = await import('./lib/prisma');
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { prisma } = await import('./lib/prisma');
  const { email, name } = req.body;
  const newUser = await prisma.user.create({     
       data: { email, name }
       });
       res.json(newUser);
});

app.delete('/users/:id', async (req, res) => {
  const { prisma } = await import('./lib/prisma');
  const { id } = req.params;
  const deletedUser = await prisma.user.delete({
    where: { id: (id) },
  });
  res.json(deletedUser);
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /users',
      'POST /users',
      'DELETE /users/:id',
      'GET /api/library/book-store',
      'POST /api/library/book-store',
      'GET /api/products',
      'GET /api/products/search?q=query'
    ]
  });
});


// Error handler
app.use((error: any, req: any, res: any, next: any) => {
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

export default app;