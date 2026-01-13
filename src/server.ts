// src/server.ts

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📚 Library API endpoints:`);
  console.log(`✅   Health: http://localhost:${PORT}/`);
  console.log(`✅  Users: http://localhost:${PORT}/users`);


  console.log(`✅  Academic Books: http://localhost:${PORT}/api/library/book-store/books`);
  console.log(`✅  All Products: http://localhost:${PORT}/api/products`);
  console.log(`✅ Search Products: http://localhost:${PORT}/api/products/search?q=physics`);




  console.log(`✅  Stationery Store: http://localhost:${PORT}/api/library/stationery-store/items`);
  console.log(`✅  Stationery Store Search by name: http://localhost:${PORT}/api/library/stationery-store/items?search=Pen`);
  console.log(`✅  Stationery Store Search by price: http://localhost:${PORT}/api/library/stationery-store/items?minPrice=20&maxPrice=100`);
  console.log(`✅  Stationery Store Search by brand: http://localhost:${PORT}/api/library/stationery-store/items?search=Reynolds`);
  
});