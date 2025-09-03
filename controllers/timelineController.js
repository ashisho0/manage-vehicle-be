const timelineService = require("../services/timelineService");
const prisma = require("../config/database");

/**
 * Save timeline for a driver over a date range
 */
async function saveTimeline(req, res, next) {
  try {
    const { driverId, dateRange, timeline } = req.body;

    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return res.status(404).json({
        error: "Driver not found",
      });
    }

    // Save timeline
    const result = await timelineService.saveTimeline(
      driverId,
      dateRange,
      timeline
    );

    res.json({
      message: "Timeline saved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get timeline for a driver over a date range
 */
async function getTimeline(req, res, next) {
  try {
    const { driverId, startDate, endDate } = req.query;

    // Convert driverId to integer
    const driverIdInt = parseInt(driverId);

    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: driverIdInt },
    });

    if (!driver) {
      return res.status(404).json({
        error: "Driver not found",
      });
    }

    const dateRange = { start: startDate, end: endDate };

    // Get timeline
    const timeline = await timelineService.getTimeline(driverIdInt, dateRange);

    // Add summary for each date
    const timelineWithSummary = {};
    Object.keys(timeline).forEach((date) => {
      const summary = timelineService.getTimelineSummary(timeline[date]);
      timelineWithSummary[date] = {
        timeline: timeline[date],
        summary: summary,
      };
    });

    res.json({
      message: "Timeline retrieved successfully",
      data: {
        driver: {
          id: driver.id,
          name: driver.name,
          licenseNumber: driver.licenseNumber,
        },
        dateRange: dateRange,
        timeline: timelineWithSummary,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  saveTimeline,
  getTimeline,
};
