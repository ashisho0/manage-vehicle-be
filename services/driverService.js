const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getDrivers() {
  return await prisma.driver.findMany({
    where: { isActive: true },
    orderBy: { id: "desc" },
  });
}

module.exports = {
  getDrivers,
};
