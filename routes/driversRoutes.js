const express = require("express");
const DriversController = require("../controllers/driversController");

const router = express.Router();

router.get("/", DriversController.getDrivers);

module.exports = router;
