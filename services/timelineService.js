const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Save timeline for a driver over a date range
 * @param {number} driverId - Driver ID
 * @param {Object} dateRange - { start: string, end: string }
 * @param {Array} timeline - Array of timeline events
 */
async function saveTimeline(driverId, dateRange, timeline) {
  try {
    // 1. Generate all dates in the range and delete existing timeline for all dates
    const dates = generateDateRange(dateRange.start, dateRange.end);

    await prisma.driverTimeline.deleteMany({
      where: {
        driverId: driverId,
        date: { in: dates },
      },
    });

    // 2. Insert new timeline events
    const timelineData = timeline.map((event) => ({
      driverId: driverId,
      date: event.startTime.split("T")[0], // Extract date from ISO string
      startTime: event.startTime.split("T")[1].split("+")[0], // Extract time
      eventType: event.eventType,
    }));

    await prisma.driverTimeline.createMany({
      data: timelineData,
    });
  } catch (error) {
    throw new Error(`Failed to save timeline: ${error.message}`);
  }
}

/**
 * Get timeline for a driver over a date range
 * @param {number} driverId - Driver ID
 * @param {Object} dateRange - { start: string, end: string }
 */
async function getTimeline(driverId, dateRange) {
  try {
    // Generate all dates in the range first
    const dates = generateDateRange(dateRange.start, dateRange.end);

    // Fetch timeline events for all dates in the range
    const timelineEvents = await prisma.driverTimeline.findMany({
      where: {
        driverId: driverId,
        date: { in: dates },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    const timelineByDate = {};

    dates.forEach((date) => {
      const dateEvents = timelineEvents.filter((event) => event.date === date);
      timelineByDate[date] = reconstructTimeline(dateEvents, date);
    });

    return timelineByDate;
  } catch (error) {
    throw new Error(`Failed to get timeline: ${error.message}`);
  }
}

/**
 * Reconstruct full timeline from events for a specific date
 * @param {Array} timelineEvents - Array of timeline events
 * @param {string} date - Date in YYYY-MM-DD format
 */
function reconstructTimeline(timelineEvents, date) {
  // Start with default state: Rest from 00:00
  let currentState = "Rest";
  let currentTime = "00:00";
  const timeline = [];

  // Sort events by time
  const sortedEvents = timelineEvents.sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  // Process each transition
  for (const event of sortedEvents) {
    // Add the period from currentTime to event.startTime
    if (currentTime !== event.startTime) {
      timeline.push({
        startTime: currentTime,
        endTime: event.startTime,
        state: currentState,
        duration: calculateDuration(currentTime, event.startTime),
      });
    }

    // Update state and time
    currentState = event.eventType;
    currentTime = event.startTime;
  }

  // Add the final period to end of day
  if (currentTime !== "24:00") {
    timeline.push({
      startTime: currentTime,
      endTime: "24:00",
      state: currentState,
      duration: calculateDuration(currentTime, "24:00"),
    });
  }

  return timeline;
}

/**
 * Calculate duration between two times in minutes
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 */
function calculateDuration(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return end - start;
}

/**
 * Convert time string to minutes since midnight
 * @param {string} time - Time in HH:MM format
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Generate array of dates between start and end
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 */
function generateDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Get timeline summary (total work/rest hours) for a date
 * @param {Array} timeline - Reconstructed timeline for a date
 */
function getTimelineSummary(timeline) {
  let totalWork = 0;
  let totalRest = 0;

  timeline.forEach((period) => {
    if (period.state === "Work") {
      totalWork += period.duration;
    } else {
      totalRest += period.duration;
    }
  });

  return {
    totalWork: minutesToHours(totalWork),
    totalRest: minutesToHours(totalRest),
  };
}

/**
 * Convert minutes to hours and minutes format
 * @param {number} minutes - Total minutes
 */
function minutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hours, minutes: mins };
}

module.exports = {
  saveTimeline,
  getTimeline,
  reconstructTimeline,
  calculateDuration,
  timeToMinutes,
  generateDateRange,
  getTimelineSummary,
  minutesToHours,
};
