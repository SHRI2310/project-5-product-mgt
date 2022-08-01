const cartModel = require("../models/cartModel");
const valid = require("../validators/validator");

const createCart = async (req, res) => {
  try {
    let data = req.body;
    let message;

    if ((message = valid(data))) {
      return res.status(400).send({ status: false, message: message });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};
