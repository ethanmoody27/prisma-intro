const prisma = require('../prisma');

const seed = async () => {
  for (let i = 1; i <= 20; i++) {
    const author = await prisma.author.create({
      data: {
        name: `Author ${i}`,
        books: {
          create: [
            { title: `Book 1 by Author ${i}` },
            { title: `Book 2 by Author ${i}` },
            { title: `Book 3 by Author ${i}` },
          ],
        },
      },
    });
    console.log(`Seeded author with ID: ${author.id}`);
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
