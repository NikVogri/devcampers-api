const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth.protect, authController.getMe);

module.exports = router;
