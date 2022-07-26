const userModel = require("../models/userModel");
const valid = require("../validators/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    let message;

    if ((message = valid.userKey(data))) {
      return res.status(400).send({ status: false, message: message });
    }
    if (!(data.password.length >= 8 && data.password.length <= 15)) {
      return res.status(400).send({
        status: false,
        message: "password must be  between  8-15 characters",
      });
    }
    let unique = await userModel
      .findOne({ $or: [{ email: data.email }, { phone: data.phone }] })
      .select({ phone: 1, email: 1, _id: 0 });

    if (unique) {
      if (unique.email == data.email) {
        return res.status(409).send({
          status: false,
          message: "email already exists, please use a different mail",
        });
      }
      if (unique.phone == data.phone) {
        return res.status(409).send({
          status: false,
          message:
            "phone no already exists, please use a different phone number",
        });
      }
    }
    await bcrypt.hash(data.password, 10).then(function (hash) {
      data.password = hash;
    });
    let result = await userModel.create(data);
    res.status(201).send({ status: true, message: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    let data = req.body;
    let userId = false;
    if (!("email" in data)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }
    if (!valid.emailRegex.test(data.email)) {
      return res
        .status(400)
        .send({ status: false, message: "email isn't valid" });
    }
    if (!("password" in data)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    let user = await userModel.findOne({ email: data.email });

    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "there is no user with this email" });
    }
    await bcrypt.compare(data.password, user.password).then(function (result) {
      if (result) {
        userId = user._id;
      }
    });
    if (userId === false) {
      return res
        .status(401)
        .send({ status: false, message: "password isn't correct" });
    }

    const token = jwt.sign({ userId: userId }, "Group19", { expiresIn: "10d" });

    res.status(200).send({
      status: true,
      message: "User logged in successfully",
      data: { userId, token },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const userProfile = async (req, res) => {
  try {
    let userId = req.params.userId;

    let user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .status({ status: false, message: "user not found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: user });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  registerUser,
  login,
  userProfile
};
