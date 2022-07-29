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
    let message;

    if ((message = valid.getProducts(data))) {
      return res.status(400).send({ status: false, message: message });
    }
    data["isDeleted"] = false;
    if ("priceSort" in data) {
      let result = await productModel
        .find(data)
        .sort({ price: data["priceSort"] });

      if (!result.length) {
        return res.status(404).send({
          status: false,
          message: "No products found with matching filters",
        });
      }

      res.send({ status: true, message: "Success", data: result });
    } else {
      let result = await productModel.find(data);

      if (!result.length) {
        return res.status(404).send({
          status: false,
          message: "No products found with matching filters",
        });
      }
      res.send({ status: true, message: "Success", data: result });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const getProductById = async (req, res) => {
  try {
    let productId = req.params.productId;

    if (!valid.id(productId)) {
      return res.status(400).send({
        status: false,
        message: "productId in path params is not valid",
      });
    }
    let result = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!result) {
      return res
        .status(404)
        .send({ status: false, message: "No products found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: result });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateProduct = async (req,res) => {

  try{
    let productId = req.params.productId
    let data = req.body
  }catch(err){
    console.log(err.message)
    res.status(500).send({status:false,message:err.message})
  }

}

module.exports = {
  createProduct,
  getProduct,
  getProductById
};
