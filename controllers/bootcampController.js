//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = (req, res, next) => {
  console.log("here");
  res.status(200).json({
    success: true,
    msg: "Get all bootcamps"
  });
};

//@desc     Get single bootcamps
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Get single bootcamp"
  });
};

//@desc     Create new bootcamps
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Create new bootcamp "
  });
};

//@desc     Update new bootcamps
//@route    PUT /api/v1/bootcamps
//@access   Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Edit bootcamp " + req.params.id
  });
};

//@desc     Delete bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Delete bootcamp"
  });
};
