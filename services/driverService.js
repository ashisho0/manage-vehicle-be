const prisma = require("../config/database");

async function getDrivers() {
  return await prisma.driver.findMany({
    where: { isActive: true },
    orderBy: { id: "desc" },
  });
}

module.exports = {
  getDrivers,
};
