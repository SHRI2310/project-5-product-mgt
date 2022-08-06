const jwt = require("jsonwebtoken");
const valid = require("../validators/validator");

const auth = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).send({
        status: false,
        message: "token is missing in authorization headers",
      });
    }
    if (!token.match("Bearer")) {
      return res
        .status(401)
        .send({
          status: false,
          message: "the token in headers isn't a bearer token",
        });
    }
    token = token.replace("Bearer ", "");

    if (!valid.id(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId in params isn't valid" });
    }

    jwt.verify(
      token,
      "Group19",
      /*async*/ (err, payload) => {
        if (err) {
          return res
            .status(401)
            .send({ status: false, message: "jwt token is not valid" });
        }
        if (payload.userId != userId) {
          return res.status(403).send({
            status: false,
            message: "You ain't authorized to perform this action",
          });
        }
        return next();
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  auth,
};
