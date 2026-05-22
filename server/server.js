const express = require("express");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const allowedOrigins = require("./config/allowedOrigins");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host:
    process.env.NODE_ENV === "production" ? process.env.DB_HOST : "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const corsOptions = {
  origin: allowedOrigins,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(cors(corsOptions));
require("./routes/auth")(pool, app);
require("./routes/register")(pool, app);
require("./routes/refresh")(app);
require("./routes/logout")(pool, app);
require("./routes/decks")(pool, app);
require("./routes/deck")(pool, app);

const PORT = process.env.NODE_PORT || 5000;

const address = "0.0.0.0";
app.listen(PORT, address, () =>
  console.log(`Server starting on ${address}:${PORT}`),
);

// Handle server shutdown
process.on("SIGINT", () => {
  console.log("Server is shutting down");

  // Release the database pool before exiting
  pool.end(() => {
    console.log("Database pool has been closed");
    app.close(() => {
      console.log("Server has been closed");
      process.exit(0);
    });
  });
});

process.on("SIGTERM", () => {
  console.log("Server is shutting down");

  // Release the database pool before exiting
  pool.end(() => {
    console.log("Database pool has been closed");
    app.close(() => {
      console.log("Server has been closed");
      process.exit(0);
    });
  });
});
