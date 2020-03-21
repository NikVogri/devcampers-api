const express = require("express");
const bootCampController = require("../controllers/bootcampController");
const advanceResults = require("../middleware/advanceResults");
const Bootcamp = require("../models/Bootcamp");
const auth = require("../middleware/auth");

// include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

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
router.post("/", auth.protect, bootCampController.createBootcamp);
router.put("/:id", auth.protect, bootCampController.updateBootcamp);
router.put("/:id/photo", auth.protect, bootCampController.bootcampPhotoUpload);
router.delete("/:id", auth.protect, bootCampController.deleteBootcamp);

module.exports = router;
