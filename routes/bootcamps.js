const express = require("express");
const bootCampController = require("../controllers/bootcampController");
const router = express.Router();

router.get("/", bootCampController.getBootcamps);

router.get("/:id", bootCampController.getBootcamp);

router.get(
  "/radius/:zipcode/:distance",
  bootCampController.getBootcampsInRadius
);

router.post("/", bootCampController.createBootcamp);

router.put("/:id", bootCampController.updateBootcamp);

router.delete("/:id", bootCampController.deleteBootcamp);

module.exports = router;
