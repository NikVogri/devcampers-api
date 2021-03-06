const express = require("express");
const bootCampController = require("../controllers/bootcampController");
const advanceResults = require("../middleware/advanceResults");
const Bootcamp = require("../models/Bootcamp");
const auth = require("../middleware/auth");

// include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

// Routes
router.get(
  "/",
  advanceResults(Bootcamp, "courses"),
  bootCampController.getBootcamps
);

router.get("/:id", bootCampController.getBootcamp);
router.get(
  "/radius/:zipcode/:distance",
  bootCampController.getBootcampsInRadius
);
router.post(
  "/",
  auth.protect,
  auth.authorize("publisher", "admin"),
  bootCampController.createBootcamp
);
router.put(
  "/:id",
  auth.protect,
  auth.authorize("publisher", "admin"),
  bootCampController.updateBootcamp
);
router.put(
  "/:id/photo",
  auth.protect,
  auth.authorize("publisher", "admin"),
  bootCampController.bootcampPhotoUpload
);
router.delete(
  "/:id",
  auth.protect,
  auth.authorize("publisher", "admin"),
  bootCampController.deleteBootcamp
);

module.exports = router;
