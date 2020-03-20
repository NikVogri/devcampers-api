const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../Utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");
const geocoder = require("../Utils/geocoder");

//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Get single bootcamps
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
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
});

//@desc     Create new bootcamps
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    msg: "Created new bootcamp ",
    data: bootcamp
  });
});

//@desc     Update new bootcamps
//@route    PUT /api/v1/bootcamps
//@access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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
});

//@desc     Delete bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with the id ${req.params.id} is not found`,
        404
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    msg: "Deleted bootcamp"
  });
});

//@desc     Get bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const location = await geocoder.geocode(zipcode);
  const lat = location[0].latitude;
  const lng = location[0].longitude;
  // Calc radius using radians
  // Devide distance by radius of earth
  // Earth radius = 6 378km
  const radius = distance / 6378;
  console.log(radius);
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  console.log(bootcamps);
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

//@desc     Upload photo for bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with the id ${req.params.id} is not found`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`File upload failed`, 400));
  }

  // check if file is actually an image
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(
      new ErrorResponse(
        `Invalid file provided, please upload an image file`,
        400
      )
    );
  }

  // check if image size is less than specified
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Image size too big, size needs to be less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
