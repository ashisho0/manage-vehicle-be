const express = require("express");
const timelineRoutes = require("./timelineRoutes");
const driversRoutes = require("./driversRoutes");

const router = express.Router();

router.use("/timeline", timelineRoutes);

router.use("/drivers", driversRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

module.exports = router;
