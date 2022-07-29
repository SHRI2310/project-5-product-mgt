const mongoose = require("mongoose");

let userFields = ["fname", "lname", "email", "phone", "password", "address"];
let nameRegex = /^[A-Za-z]+$/;
let positive = /^[0-9]+$/;
let cityRegex = /^[A-Za-z ]+$/;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let phoneRegex = /^[6-9]{1}[0-9]{9}$/;
let pinRegex = /^[1-9][0-9]{5}$/;

//USER VALIDATIONS
function createUser(body) {
  if (JSON.stringify(body) == "{}") return "request body cannot be empty";
  let error = userFields
    .map((x) => {
      if (!(x in body)) return `${x} is missing`;

      if (x == "address") return;

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
        if (x == "address") return;

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
      } else invalidKey++;
      return false;
    })
    .find((x) => x != undefined && x != false);

  if (error) return error;
  if (invalidKey == 6) return "The data sent you is invalid";
}

//PRODUCT VALIDATIONS
let productFields = [
  "title",
  "description",
  "price",
  "currencyId",
  "availableSizes",
];

let productSize = ["S", "XS", "M", "X", "L", "XXL", "XL"];

function createProduct(body) {
  if (JSON.stringify(body) == "{}") return "request body cannot be empty";

  body["currencyFormat"] = "₹";

  if ("style" in body) productFields.push("style");

  let error = productFields
    .map((x) => {
      if (!(x in body)) return `${x} is missing`;

      if (x == "availableSizes") {
        if (typeof body["availableSizes"] == "string") {
          body["availableSizes"] = body["availableSizes"].split();
          return;
        }
        if (Array.isArray(body["availableSizes"])) return;
        return "availableSizes can only be a string or an array of strings";
      }

      if (x == "price") {
        if (body[x] <= 0) return `price must be a positive number`;
        body[x] = Number(body[x])
        return;
      }

      if (typeof body[x] != "string") return `${x} should must be a string`;

      body[x] = body[x].trim();
      let key = body[x];

      if (!key.length) return `${x} can't be empty`;

      if (x == "currencyId") {
        if (body[x] != "INR") return `${x} must be in "INR" format`;
      }
    })
    .find((x) => x != undefined);

  if (error) return error;

  if (!body["availableSizes"].length)
    return "availableSizes array can't be empty";

  let len = body["availableSizes"].length;

  for (let i = len - 1; i >= 0; i--) {
    if (!productSize.includes(body["availableSizes"][i])) {
      body["availableSizes"].splice(i, 1);
    }
  }

  if (!body["availableSizes"].length)
  return "availableSizes array doesn't have any valid size";

  if ("isFreeShipping" in body) {
    if (typeof body["isFreeShipping"] != "boolean")
      return `isFreeShipping must be a boolean value`;
  }
  if ("installments" in body) {
    if (typeof body["installments"] != "number")
      return "installments must be a number";
    if (body["installments"] <= 0)
      return "installments must be greater than zero";
    if (!positive.test(body["installments"]))
      return "installment count must be a natural number";
  }
}

let filters = [
  "size",
  "name",
  "priceGreaterThan",
  "priceLessThan",
  "priceSort",
];

function getProducts(query) {

  if (JSON.stringify(query) == "{}") return

  for (let key in query) {
    if (!filters.includes(key)) {
      delete query[key];
    }
  }
  if (JSON.stringify(query) == "{}") return "these aren't valid filters";

  if (
    "size" in query &&
    typeof query.size != "string" &&
    !Array.isArray(query.size)
  ) {
    return "size filter can only be a string or an array of strings";
  }

  if (typeof query.size == "string") {
    if (!productSize.includes(query.size)) {
      return `please provide a size filter from one of these ${productSize}`;
    }
    query["availableSizes"] = query.size.split();
    delete query.size;
  }
  if (Array.isArray(query.size)) {
    let arr = query.size.filter((x) => productSize.includes(x));
    if (!arr.length) {
      return `please provide a size filter from one of these ${productSize}`;
    }
    query["availableSizes"] = query.size;
    delete query.size;
  }
  if ("name" in query) {
    if (typeof query.name != "string") {
      return "name in filter should be a string";
    }
    query["title"] = query.name.trim();
    delete query.name;

    if (!query["title"].length) {
      return "name in filter can't be empty";
    }
  }
  if ("priceGreaterThan" in query) {
    if (!positive.test(query["priceGreaterThan"])) {
      return "priceGreaterThan should be a whole number";
    }
    query["$and"] = [{price:{$gte:query["priceGreaterThan"]}}]
    delete query["priceGreaterThan"]
  }
  if ("priceLessThan" in query) {
    if (!positive.test(query["priceLessThan"])) {
      return "priceLessThan must be a natural number";
    }
    if(query["priceLessThan"]==0){
      return "priceLessThan filter must be greater than zero"
    }
    if(!query["$and"]){
      query["$and"] = [{price:{$lte:query["priceLessThan"]}}]
      delete query["priceLessThan"]
    }else{
      query["$and"].push({price:{$lte:query["priceLessThan"]}})
      delete query["priceLessThan"]
    }
  }
  if("priceSort" in query){
    if(!(query["priceSort"]==1 || query["priceSort"]==-1)){
      return "priceSort filter should be a number equal to 1 or -1"
    }
  }
}
function profileImage(arr) {
  if (!arr.length) return "profileImage file is missing";
  let check = false;
  let ele = arr.find((x) => {
    if (x["fieldname"] == "profileImage") {
      check = true;
      if (
        x.mimetype == "image/png" ||
        x.mimetype == "image/jpg" ||
        x.mimetype == "image/jpeg"
      ) {
        arr[0] = x;
        return true;
      }
    }
  });

  if (!check) return "profileImage file is required";
  if (!ele) return "the format of profileImage is invalid";
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
  profileImage,
  getProducts
};

// if ("size" in query) {
//   if (typeof query.size == "string") {
//     if (!productSize.includes(query.size)) {
//       return "please provide a valid size in the filters";
//     }
//   } else if (Array.isArray(query.size)) {
//   } else return "size filter accepts array or string";
// }
