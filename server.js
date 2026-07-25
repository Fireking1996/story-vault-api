const express = require("express");
require("dotenv").config();

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const cors = require("cors");

const passport = require("./config/passport");

const { connectDB } = require("./db/connect");

const storiesRoute = require("./routes/stories");
const ideasRoute = require("./routes/ideas");
const authRoute = require("./routes/auth");

const app = express();
app.set("trust proxy", 1);
app.use(cors());

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Story Vault API is working");
});

async function startServer() {
  await connectDB();

  app.use("/stories", storiesRoute);
  app.use("/ideas", ideasRoute);
  app.use("/auth", authRoute);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();