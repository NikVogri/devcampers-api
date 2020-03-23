const express = require("express");
const userController = require("../controllers/usersController");
const advancedResults = require("../middleware/advanceResults");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth.protect);
router.use(auth.authorize("admin"));

router.get("/", advancedResults(User), userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
