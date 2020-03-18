const nodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "3tSSKAVjy5M60sZi4Ml8H9bs0V6jW756",
  formatter: null
};

const geocoder = nodeGeocoder(options);

module.exports = geocoder;
