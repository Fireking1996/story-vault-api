const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Story Vault API",
      version: "1.0.0",
      description: "API for managing stories and writing ideas"
    },
    
    servers: [
      {
        url: "https://story-vault-api-6ywk.onrender.com"
      },
      {
    url: "http://localhost:3000"
  }
    ],
     components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid"
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;