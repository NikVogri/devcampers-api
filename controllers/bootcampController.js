const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../Utils/errorResponse");
//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      msg: "Got all bootcamps",
      count: bootcamps.length,
      data: bootcamps
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Get single bootcamps
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp with the id ${req.params.id} is not found`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      msg: "Got signe bootcamp",
      data: bootcamp
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Create new bootcamps
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      msg: "Created new bootcamp ",
      data: bootcamp
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Update new bootcamps
//@route    PUT /api/v1/bootcamps
//@access   Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp with the id ${req.params.id} is not found`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      msg: "Edit bootcamp " + req.params.id,
      data: bootcamp
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Delete bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp with the id ${req.params.id} is not found`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      msg: "Deleted bootcamp"
    });
  } catch (error) {
    next(error);
  }
};
