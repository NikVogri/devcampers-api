const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/db");
const errorHandler = require("./middleware/err-handler");

// Route files
const bootcampsRoutes = require("./routes/bootcamps");
const coursesRoutes = require("./routes/courses");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
// Load env vars in development enviroment
dotenv.config({
  path: "./config/config.env"
});

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Connect to database
connectDatabase();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Routers
app.use("/api/v1/bootcamps", bootcampsRoutes);
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);

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
