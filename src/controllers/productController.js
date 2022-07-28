const productModel = require("../models/productModel");
const valid = require("../validators/validator");

const createProduct = async (req, res) => {
  try {
    let data = req.body;
    let message;

    if ((message = valid.createProduct(data))) {
      return res.status(400).send({ status: false, message: message });
    }
    let result = await productModel.create(data);
    res.status(201).send({ status: true, message: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    let data = req.query;
    let message

    if(message = valid.getProducts(data)){
      return res.status(400).send({status:false,message:message})
    }

    let result = await productModel.find(data)
    res.send(result)
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  createProduct,
  getProduct
};
