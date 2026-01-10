

import express from 'express';
import { prisma } from './lib/prisma';

const app = express();
const PORT = 5000;
app.get('/', (req, res) => {
  res.send('Hello World! mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', express.json(), async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
