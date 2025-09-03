const express = require("express");
const router = express.Router();
const timelineController = require("../controllers/timelineController");
const { validateRequest } = require("../middleware/validation");
const {
  saveTimelineSchema,
  getTimelineQuerySchema,
} = require("../schemas/timelineSchemas");

router.get(
  "/",
  validateRequest(getTimelineQuerySchema),
  timelineController.getTimeline
);

router.post(
  "/",
  validateRequest(saveTimelineSchema),
  timelineController.saveTimeline
);

module.exports = router;
