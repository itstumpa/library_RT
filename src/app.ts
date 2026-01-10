// src/app.ts

import express from 'express';
import academicBookRoutes from './modules/library/academic-book-store/academicBookStore.routes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/academic-book-store', academicBookRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Library API is running!' });
});

export default app;