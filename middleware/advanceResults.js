const advancedResults = (model, populate) => async (req, res, next) => {
  console.log("heree");
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

  query = model.find(JSON.parse(queryString));

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
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;
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
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };
  next();
};

module.exports = advancedResults;
