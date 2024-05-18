const Product = require("../models/product");

const getAllProductStatic = async (req, res) => {
  // for testing api result
  const products = await Product.find({})
    .sort("name")
    .select("name price")
    .limit(10)
    .skip(3);

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // console.log(req.query); // { name: 'john', feature: 'true' }
  const { featured, company, name, sort, fields } = req.query;
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

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductStatic, getAllProducts };
