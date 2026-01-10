// src/modules/library/academicBookStore/academicBookStore.service.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CREATE - Add new book
const createBook = async (data: {
  title: string;
  author: string;
  subject: string;
  price: number;
  stock?: number;
  description?: string;
}) => {
  const book = await prisma.academicBook.create({
    data: data,
  });
  return book;
};

// READ - Get all books
const getAllBooks = async () => {
  const books = await prisma.academicBook.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return books;
};

// READ - Get single book by ID
const getBookById = async (id: string) => {
  const book = await prisma.academicBook.findUnique({
    where: { id: id },
  });
  return book;
};

// UPDATE - Update book by ID
const updateBook = async (
  id: string,
  data: {
    title?: string;
    author?: string;
    subject?: string;
    price?: number;
    stock?: number;
    description?: string;
  }
) => {
  const book = await prisma.academicBook.update({
    where: { id: id },
    data: data,
  });
  return book;
};

// DELETE - Delete book by ID
const deleteBook = async (id: string) => {
  const book = await prisma.academicBook.delete({
    where: { id: id },
  });
  return book;
};

export default {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};