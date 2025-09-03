const { getDrivers: getDriversService } = require("../services/driverService");

const getDrivers = async (req, res, next) => {
  try {
    const result = await getDriversService();

    res.json({ message: "Drivers retrieved successfully", data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDrivers,
};
