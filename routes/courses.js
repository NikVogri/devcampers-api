const express = require("express");
const coursesController = require("../controllers/courseController");
const Course = require("../models/Course");
const advanceResults = require("../middleware/advanceResults");
const auth = require("../middleware/auth");

// merging url params from bootcamps
const router = express.Router({ mergeParams: true });

// Routes
router.get(
  "/",
  advanceResults(Course, "bootcamp"),
  coursesController.getAllCourses
);
router.get("/:id", coursesController.getSingleCourse);
router.put("/:id", auth.protect, coursesController.updateCourse);
router.delete("/:id", auth.protect, coursesController.deleteCourse);
router.post("/", auth.protect, coursesController.addCourse);

module.exports = router;
