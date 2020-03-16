const express = require("express");
const dotenv = require("dotenv");

const morgan = require("morgan");
// Route files
const bootcampsRoutes = require("./routes/bootcamps");

// Load env vars in development enviroment
dotenv.config({
  path: "./config/config.env"
});

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Routers
app.use("/api/v1", bootcampsRoutes);

// server init
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
