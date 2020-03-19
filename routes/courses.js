const express = require("express");
const coursesController = require("../controllers/courseController");

// merging url params from bootcamps
const router = express.Router({ mergeParams: true });

router.get("/", coursesController.getAllCourses);
router.get("/:id", coursesController.getSingleCourse);
router.put("/:id", coursesController.updateCourse);
router.delete("/:id", coursesController.deleteCourse);
router.post("/", coursesController.addCourse);

module.exports = router;
