const userModel = require("../models/userModel");
const valid = require("../validators/validator");

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    let message;

    if ((message = valid.userKey(data))) {
      return res
        .status(400)
        .send({ status: false, message:message });
    }
    console.log(req.body)
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  registerUser,
};
