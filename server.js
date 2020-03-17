const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDatabase = require("./config/db");
const errorHandler = require("./middleware/err-handler");
// Route files
const bootcampsRoutes = require("./routes/bootcamps");

// Load env vars in development enviroment
dotenv.config({
  path: "./config/config.env"
});

const app = express();

// Middlewares
app.use(express.json());

// Connect to database
connectDatabase();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Routers
app.use("/api/v1", bootcampsRoutes);

// ErrorHandler - Middleware
app.use(errorHandler);

// server init
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
