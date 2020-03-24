const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", auth.protect, authController.getMe);
router.post("/forgotpassword", authController.forgotPassword);
router.put("/resetpassword/:resettoken", authController.resetPassword);
router.put("/updatedetails", auth.protect, authController.updateDetails);
router.put("/updatepassword", auth.protect, authController.updatePassword);

module.exports = router;
