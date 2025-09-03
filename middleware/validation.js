const { Validator } = require("jsonschema");

/**
 * Validates data against a JSON schema
 * @param {Object} data - data to be validated
 * @param {Object} schema - JSON schema template
 * @throws {Error} - throws error if validation fails
 */
function validateJsonSchema(data, schema) {
  const validator = new Validator();
  const result = validator.validate(data, schema);

  if (!result.valid) {
    const errorMessage = result.errors
      .reduce((previous, next) => {
        previous.push(next.stack);
        return previous;
      }, [])
      .join(" | ");

    throw new Error(errorMessage);
  }
}

/**
 * Middleware to validate request against JSON Schema
 * @param {Object} schema - JSON Schema to validate against
 */
function validateRequest(schema) {
  return (req, res, next) => {
    try {
      // Extract only the parts we want to validate
      const validationData = {};

      if (schema.properties.body) {
        validationData.body = req.body;
      }

      if (schema.properties.query) {
        validationData.query = req.query;
      }

      if (schema.properties.params) {
        validationData.params = req.params;
      }

      validateJsonSchema(validationData, schema);
      next();
    } catch (error) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Request validation failed",
        details: error.message,
      });
    }
  };
}

module.exports = {
  validateRequest,
};
