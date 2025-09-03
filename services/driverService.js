const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getDrivers() {
  return await prisma.driver.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

module.exports = {
  getDrivers,
};
