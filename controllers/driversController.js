const { getDrivers: getDriversService } = require("../services/driverService");

const getDrivers = async (req, res) => {
  const result = await getDriversService();

  res.json({ message: "Drivers retrieved successfully", data: result });
};

module.exports = {
  getDrivers,
};
