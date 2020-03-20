const express = require("express");
const coursesController = require("../controllers/courseController");
const Course = require("../models/Course");
const advanceResults = require("../middleware/advanceResults");
// merging url params from bootcamps
const router = express.Router({ mergeParams: true });

// Routes
router.get(
  "/",
  advanceResults(Course, "bootcamp"),
  coursesController.getAllCourses
);
router.get("/:id", coursesController.getSingleCourse);
router.put("/:id", coursesController.updateCourse);
router.delete("/:id", coursesController.deleteCourse);
router.post("/", coursesController.addCourse);

module.exports = router;
