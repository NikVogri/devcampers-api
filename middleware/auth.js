const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../Utils/errorResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //   else if (req.cookies.token) {
  //       token = req.cookies.token;
  //   }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse("Not authorized to access this content", 401)
    );
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(
      new ErrorResponse("Not authorized to access this content", 401)
    );
  }
});

// Grand acces to specifif roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to acces this content`,
          403
        )
      );
    }
    next();
  };
};
