const express = require('express');
const app = express();
const port = 3000;

const prisma = require('./prisma/schema.prisma');

app.use(express.json());

app.get('/authors', async (req, res) => {
    const authors = await prisma.author.findMany();
    res.json(authors);
});

app.post('/authors', async (req, res) => {
    const { name } = req.body;
    const author = await prisma.author.create({
        data: { name }
    });
    res.json(author);
});

app.get('/authors/:id', async (req, res) => {
    const { id } = req.params;
    const author = await prisma.author.findUnique({ where: { id: parseInt(id) } });
    if (!author) {
        res.status(404).json({ message: 'Author not found' });
    } else {
        res.json(author);
    }
});

app.put('/authors/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const author = await prisma.author.update({
        where: { id: parseInt(id) },
        data: { name },
    });
    res.json(author);
});

app.delete('/authors/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.author.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Author deleted' });
});

app.get('/authors/:id/books', async (req, res) => {
    const { id } = req.params;
    const books = await prisma.book.findMany({
        where: { authorId: parseInt(id) },
    });
    res.json(books);
});

app.post('/authors/:id/books', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const book = await prisma.book.create({
      data: {
        title,
        author: { connect: { id: parseInt(id) } },
      },
    });
    res.json(book);
  });

  app.get('/books', async (req, res) => {
      const books = await prisma.book.findMany();
      res.json(books);
  });

  app.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book) {
        res.status(404).json({ message: 'Book not found' });
    } else {
        res.json(book);
    }
});

app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const book = await prisma.book.update({
        where: { id: parseInt(id) },
        data: { title },
    });
    res.json(book);
});

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Book deleted' });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
