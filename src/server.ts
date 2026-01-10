// src/server.ts

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📚 Library API endpoints:`);
  console.log(`✅   Health: http://localhost:${PORT}/`);
  console.log(`✅  Users: http://localhost:${PORT}/users`);
  console.log(`✅  Academic Books: http://localhost:${PORT}/api/library/academic-book-store`);
  console.log(`✅  All Products: http://localhost:${PORT}/api/products`);
  console.log(`✅ Search Products: http://localhost:${PORT}/api/products/search?q=physics`);
});