const express = require("express");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const allowedOrigins = require("./config/allowedOrigins");
require("dotenv").config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
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
// app.use("/auth", require("./routes/auth")(pool, app))
// app.use("/decks", require("./routes/decks")(pool, app))
// app.use("/deck", require("./routes/deck")(pool, app))
require("./routes/auth")(pool, app);
require("./routes/register")(pool, app);
require("./routes/refresh")(app);
require("./routes/logout")(pool, app);
require("./routes/decks")(pool, app);
require("./routes/deck")(pool, app);

const PORT = process.env.NODE_ENV || 8080;

app.listen(PORT, () => console.log(`Server starting on PORT ${PORT}`));

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
