const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const valid = require("../validators/validator");

const createCart = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.params.userId;
    let cart;

    if ((cart = valid.createCart(data))) {
      return res.status(400).send({ status: false, message: cart });
    }
    let user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "there is no user with this id" });
    }
    cart = await cartModel.findOne({ userId: userId });
    if ("cartId" in data) {
      if (!cart) {
        return res.status(404).send({
          status: false,
          message:
            "there is no cart for this user yet please dont't send the cartId",
        });
      }
      if (cart._id != data["cartId"]) {
        return res.status(403).send({
          status: false,
          message: "the cartId you sent doesn't belong to this user",
        });
      }
    }
    let product = await productModel.findOne({
      _id: data["productId"],
      isDeleted: false,
    });
    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "there is no prodcut with this id" });
    }
    if (cart) {
      let cartItems = cart["items"];

      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i]["productId"] == data["productId"]) {
          cartItems[i]["quantity"] += data["quantity"];
          break;
        } else if (i == cartItems.length - 1) {
          cartItems.push(({ productId, quantity } = data));
        }
      }
      let newPrice = cart["totalPrice"] + product["price"] * data["quantity"];
      let newItems = cart["totalItems"] + data["quantity"];
      let result = await cartModel.findByIdAndUpdate(
        cart._id,
        {
          items: cartItems,
          totalPrice: newPrice,
          totalItems: newItems,
        },
        { new: true }
      );
      return res.status(200).send({ status: true, message: result });
    } else {
      let items = [({ productId, quantity } = data)];
      let totalPrice = product["price"] * data["quantity"];
      let result = await cartModel.create({
        userId,
        items,
        totalPrice,
        totalItems: data["quantity"],
      });
      return res.status(201).send({ status: true, message: result });
    }
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

    let cart = await cartModel.findByIdAndDelete(cart["_id"]);
    if (!cart) {
      return res
        .status(404)
        .send({ status: false, message: "there is no cart for this user" });
    }

    return res
      .status(204)
      .send({ status: true, message: "Success", data: cart });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createCart,
  getCart,
  deleteCart
};
