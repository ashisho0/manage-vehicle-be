const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["error", "warn"],
  datasources: {
    db: {
      url: "file:../database.sqlite?connection_limit=1&pool_timeout=60&socket_timeout=60",
    },
  },
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
