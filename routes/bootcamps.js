const express = require("express");
const bootCampController = require("../controllers/bootcampController");
const router = express.Router();

router.get("/bootcamps", bootCampController.getBootcamps);

router.get("/bootcamps/:id", bootCampController.getBootcamp);

router.post("/bootcamps", bootCampController.createBootcamp);

router.put("/bootcamps/:id", bootCampController.updateBootcamp);

router.delete("/bootcamps/:id", bootCampController.deleteBootcamp);

module.exports = router;
