import express from 'express';
import { prisma } from './lib/prisma';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Hello World library!');
});

// Your existing user routes
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { email, name } = req.body;
  const newUser = await prisma.user.create({     
       data: { email, name }
       });
       res.json(newUser);
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const deletedUser = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json(deletedUser);
});

// ============================================
// NEW: ACADEMIC BOOK STORE ROUTES
// ============================================

// CREATE
app.post('/api/academic-book-store', async (req, res) => {
  try {
    const book = await prisma.academicBook.create({
      data: req.body,
    });
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: String(error),
    });
  }
});

// GET ALL
app.get('/api/academic-book-store', async (req, res) => {
  try {
    const books = await prisma.academicBook.findMany();
    res.status(200).json({
      success: true,
      message: 'Books fetched successfully',
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: String(error),
    });
  }
});

// GET ONE
app.get('/api/academic-book-store/:id', async (req, res) => {
  try {
    const book = await prisma.academicBook.findUnique({
      where: { id: req.params.id },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book fetched successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: String(error),
    });
  }
});

// UPDATE
app.put('/api/academic-book-store/:id', async (req, res) => {
  try {
    const book = await prisma.academicBook.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: String(error),
    });
  }
});

// DELETE
app.delete('/api/academic-book-store/:id', async (req, res) => {
  try {
    await prisma.academicBook.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});