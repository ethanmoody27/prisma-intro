const express = require('express');
const app = express();
const port = 3000;

const prisma = require('./prisma/schema.prisma');

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Authors routes
app.get('/authors', async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

app.post('/authors', async (req, res, next) => {
  try {
    const { name } = req.body;
    const author = await prisma.author.create({ data: { name } });
    res.json(author);
  } catch (error) {
    next(error);
  }
});

app.get('/authors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await prisma.author.findUnique({ where: { id: parseInt(id) } });
    if (!author) {
      res.status(404).json({ message: 'Author not found' });
    } else {
      res.json(author);
    }
  } catch (error) {
    next(error);
  }
});

app.put('/authors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const author = await prisma.author.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(author);
  } catch (error) {
    next(error);
  }
});

app.delete('/authors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.author.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Author deleted' });
  } catch (error) {
    next(error);
  }
});

app.get('/authors/:id/books', async (req, res, next) => {
  try {
    const { id } = req.params;
    const books = await prisma.book.findMany({ where: { authorId: parseInt(id) } });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

app.post('/authors/:id/books', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const book = await prisma.book.create({
      data: {
        title,
        author: { connect: { id: parseInt(id) } },
      },
    });
    res.json(book);
  } catch (error) {
    next(error);
  }
});

// Books routes
app.get('/books', async (req, res, next) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    next(error);
  }
});

app.get('/books/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.json(book);
    }
  } catch (error) {
    next(error);
  }
});

app.put('/books/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title },
    });
    res.json(book);
  } catch (error) {
    next(error);
  }
});

app.delete('/books/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
