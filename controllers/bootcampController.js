const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../Utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../Utils/geocoder");

//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from query
  removeFields.forEach(param => delete reqQuery[param]);

  // Stringify it so we can manipulate
  let queryString = JSON.stringify(reqQuery);

  // Find and edit to ($gt, $gte, ...) vvvv
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => {
    return `$${match}`;
  });

  query = Bootcamp.find(JSON.parse(queryString));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Select Sort By
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination - Page 1 is default if not specified
  const page = parseInt(req.query.page, 10) || 1;
  // how many to display per page
  const limit = parseInt(req.query.limit, 10) || 100;
  // where to start
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;
  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    msg: "Got all bootcamps",
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
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
});

//@desc     Get bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private
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
