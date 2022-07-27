const productModel = require("../models/productModel");
const valid = require("../validators/validator");

const createProduct = async (req, res) => {
  try {
    let data = req.body
    

  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};
