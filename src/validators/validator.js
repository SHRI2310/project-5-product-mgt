const mongoose = require("mongoose");

let userFields = ["fname", "lname", "email", "phone", "password", "address"];
let productFields = [
  "title",
  "description",
  "price",
  "currencyId",
  "currencyFormat",
  "availableSizes",
];
let nameRegex = /^[A-Za-z]+$/;
let cityRegex = /^[A-Za-z ]+$/;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let phoneRegex = /^[6-9]{1}[0-9]{9}$/;
let pinRegex = /^[1-9][0-9]{5}$/;

function createUser(body) {
  if (JSON.stringify(body) == "{}") return "request body cannot be empty";
  let error = userFields
    .map((x) => {
      if (!(x in body)) return `${x} is missing`;

      if (x != "address") {
        if (typeof body[x] != "string") return `${x} should must be a string`;

        body[x] = body[x].trim();
        let key = body[x];

        if (!key.length) return `${x} can't be empty`;

        if (x == "fname" || x == "lname") {
          if (!nameRegex.test(key))
            return `${x} can only have alphabets without spaces`;
          if (key.length < 3) return `${x} has to be atleast 3 characters long`;
        }

        if (key.match(" ")) return `${x} cannot have spaces`;

        if (x == "email") {
          if (!emailRegex.test(key)) return `${x} is not a valid email`;
        }

        if (x == "phone") {
          if (!phoneRegex.test(key)) return `${x} number is  not valid`;
        }
      }
    })
    .find((x) => x != undefined);

  if (error) return error;
}

function address(ele) {}

function updateUser(body) {
  if (JSON.stringify(body) == "{}") return "request body cannot be empty";
  let invalidKey = 0;
  let error = userFields
    .map((x) => {
      if (x in body) {
        if (x != "address") {
          if (typeof body[x] != "string") return `${x} should must be a string`;

          body[x] = body[x].trim();
          let key = body[x];

          if (!key.length) return `${x} can't be empty`;

          if (x == "fname" || x == "lname") {
            if (!nameRegex.test(key))
              return `${x} can only have alphabets without spaces`;
            if (key.length < 3)
              return `${x} has to be atleast 3 characters long`;
          }

          if (key.match(" ")) return `${x} cannot have spaces`;

          if (x == "email") {
            if (!emailRegex.test(key)) return `${x} is not a valid email`;
          }

          if (x == "phone") {
            if (!phoneRegex.test(key)) return `${x} number is  not valid`;
          }
        }
      } else invalidKey++;
      return false;
    })
    .find((x) => x != undefined && x != false);

  if (error) return error;
  if (invalidKey == 6) return "The data sent you is invalid";
}

function createProduct(body) {
  if (JSON.stringify(body) == "{}") return "request body cannot be empty";

  body["currencyFormat"] = "₹";

  let error = productFields
    .map((x) => {
      if (!(x in body)) return `${x} is missing`;

      if (x == "price") {
        if (typeof body[x] != "number") return `price must be a number`;
        if (body[x] <= 0) return `price must be a positive number`;
        return;
      }

      if (typeof body[x] != "string") return `${x} should must be a string`;

      body[x] = body[x].trim();
      let key = body[x];

      if (!key.length) return `${x} can't be empty`;

      if (key.match(" ")) return `${x} cannot have spaces`;

      if (x == "currencyId") {
        if (body[x] != "INR") return `${x} must be in "INR" format`;
      }
    })
    .find((x) => x != undefined);

  if (error) return error;

  if ("isFreeShipping" in body) {
    if (body["isFreeShipping"] != "boolean")
      return `isFreeShipping must be a boolean value`;
  }
  if ("style" in body) {
    if (typeof (body["style"] != "string"))
      return `style should must be a string`;
  }
  if ("installments" in body) {
    if (typeof body["installments"] != "number")
      return "installments must be a number";
    if (body["installments"] <= 0)
      return "installments must be greater than zero";
  }
}

function profileImage(arr) {
  if (!arr.length) return "profileImage file is missing";
  let check = false
  let ele = arr.find((x) => {
    if (x["fieldname"] == "profileImage") {
      check = true
      if (
        x.mimetype == "image/png" ||
        x.mimetype == "image/jpg" ||
        x.mimetype == "image/jpeg"
      ) {
        arr[0] = x
        return true;
      }
    }
  });

  if(!check) return "profileImage file is required"
  if(!ele) return "the format of profileImage is invalid"

}

function id(id) {
  if (mongoose.isValidObjectId(id) && id.length == 24) return true;
  return false;
}

module.exports = {
  createUser,
  emailRegex,
  id,
  updateUser,
  createProduct,
  profileImage
};
