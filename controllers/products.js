const Product = require("../models/product");

const getAllProductStatic = async (req, res) => {
  // for testing api result
  const products = await Product.find({ price: { $gt: 40, $lt: 100 } })
    .sort("price")
    .select("name price");

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // console.log(req.query); // { name: 'john', feature: 'true' }
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === true ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // { numericFilters: 'price>40,rating>=4' }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    console.log(numericFilters); // { numericFilters: 'price>40,rating>=4' }
    console.log(filters); // price-$gt-40,rating-$gte-4
  }

  // console.log(queryObject); // { featured: false }, {}, etc.
  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    console.log(sortList);
    result = result.sort(sortList);
  } else {
    result = result.sort("createAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    console.log(fieldsList);
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = Number(page - 1) * limit;
  console.log(req.query); // { sort: '-name,-price', fields: 'name,price', page: '4' }

  result = result.skip(skip).limit(limit); // 23

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductStatic, getAllProducts };
