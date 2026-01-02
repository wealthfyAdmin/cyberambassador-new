const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node API",
      version: "1.0.0",
      description: "Authentication, User, Chat and LiveKit APIs",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  /**
   * VERY IMPORTANT
   * This tells swagger-jsdoc where to look for annotations
   */
  apis: [
    "./src/controllers/**/*.swagger.js",
    "./src/controllers/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
