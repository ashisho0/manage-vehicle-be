/**
 * JSON Schemas for timeline validation
 */

// Schema for saving timeline (POST /api/timeline)
const saveTimelineSchema = {
  id: "save-timeline",
  type: "object",
  required: ["body"],
  properties: {
    body: {
      type: "object",
      required: ["driverId", "dateRange", "timeline"],
      properties: {
        driverId: {
          type: "integer",
          minimum: 1,
          description: "Driver ID must be a positive integer",
        },
        dateRange: {
          type: "object",
          required: ["start", "end"],
          properties: {
            start: {
              type: "string",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
              description: "Start date in YYYY-MM-DD format",
            },
            end: {
              type: "string",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
              description: "End date in YYYY-MM-DD format",
            },
          },
          additionalProperties: false,
        },
        timeline: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["startTime", "eventType"],
            properties: {
              startTime: {
                type: "string",
                pattern:
                  "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:\\d{2}$",
                description:
                  "Start time in ISO format with timezone offset (e.g., 2025-08-12T07:10:00+10:00)",
              },
              eventType: {
                type: "string",
                enum: ["Work", "Rest"],
                description: "Event type must be either 'Work' or 'Rest'",
              },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

// Schema for getting timeline query parameters (GET /api/timeline)
const getTimelineQuerySchema = {
  id: "get-timeline",
  type: "object",
  required: ["query"],
  properties: {
    query: {
      type: "object",
      required: ["driverId", "startDate", "endDate"],
      properties: {
        driverId: {
          type: "string",
          pattern: "^\\d+$",
          description: "Driver ID must be a numeric string",
        },
        startDate: {
          type: "string",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
          description: "Start date in YYYY-MM-DD format",
        },
        endDate: {
          type: "string",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
          description: "End date in YYYY-MM-DD format",
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

module.exports = {
  saveTimelineSchema,
  getTimelineQuerySchema,
};
