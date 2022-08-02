const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const valid = require("../validators/validator");

const createCart = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.params.userId;
    let message;

    if ((message = valid.createCart(data))) {
      return res.status(400).send({ status: false, message: message });
    }
    let user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "there is no user with this id" });
    }
    if ("cartId" in data) {
      let cart = await cartModel.findById(data["cartId"]);
      if (!cart) {
        return res
          .status(404)
          .send({ status: false, message: "there is no cart with this Id" });
      }
      if (cart["userId"] != userId) {
        return res.status(403).send({
          status: false,
          message: "you can't add products in someone else's cart",
        });
      }
    }
    let product = productModel.findOne({
      _id: data["productId"],
      isDeleted: false,
    });
    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "there is no prodcut with this id" });
    }
    // if("cartId" in data){
    //   let result =
    // }else{

    // }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    let userId = req.params.userId;

    let cart = await cartModel.findOne({ userId: userId });
    if (!cart) {
      return res
        .status(404)
        .send({ status: false, message: "there is no cart for this user" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: cart });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    let userId = req.params.userId;

    let cart = await cartModel.findOne({ userId: userId });
    if (!cart) {
      return res
        .status(404)
        .send({ status: false, message: "there is no cart for this user" });
    }
    let result = await cartModel.findByIdAndDelete(cart["_id"])
    
    return res
      .status(200)
      .send({ status: true, message: "Success", data: cart });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};
