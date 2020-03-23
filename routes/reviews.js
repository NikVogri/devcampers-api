const express = require("express");
const reviewController = require("../controllers/reviewController");
const advancedResults = require("../middleware/advanceResults");
const Review = require("../models/Review");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth");

router.get(
  "/",
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description"
  }),
  reviewController.getReviews
);
router.put(
  "/:id",
  auth.protect,
  auth.authorize("user", "admin"),
  reviewController.updateReview
);
router.post(
  "/",
  auth.protect,
  auth.authorize("user", "admin"),
  reviewController.addReview
);

router.delete(
  "/:id",
  auth.protect,
  auth.authorize("user", "admin"),
  reviewController.deleteReview
);

router.get("/:id", reviewController.getReview);

module.exports = router;
