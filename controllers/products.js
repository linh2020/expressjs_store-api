const Product = require("../models/product");

const getAllProductStatic = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  console.log(req.query); // { name: 'john', feature: 'true' }
  const products = await Product.find(req.query);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductStatic, getAllProducts };
