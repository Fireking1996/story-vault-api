const express = require("express");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const { connectDB } = require("./db/connect");

const storiesRoute = require("./routes/stories");
const ideasRoute = require("./routes/ideas");

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Story Vault API is working");
});

async function startServer() {
  await connectDB();

  app.use("/stories", storiesRoute);
  app.use("/ideas", ideasRoute);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();