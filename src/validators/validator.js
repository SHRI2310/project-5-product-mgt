const mongoose = require("mongoose");
const cartModel = require("../models/cartModel");

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

function address(ele) {
  let arr = ["shipping", "billing"];
  let arr1 = ["street", "city", "pincode"];

  if (!(typeof ele == "object" && Array.isArray(ele) != true && ele != null)) {
    return `address must be an object`;
  }

  let error = arr
    .map((x) => {
      if (!(x in ele)) {
        return `${x} address is missing in address`;
      }

      if (
        !(
          typeof ele[x] == "object" &&
          Array.isArray(ele[x]) != true &&
          ele[x] != null
        )
      ) {
        return `${x} address must be an object`;
      }

      return arr1
        .map((y) => {
          if (!(y in ele[x])) {
            return `${y} in ${x} address is missing`;
          }
          if (y == "pincode") {
            if (!pinRegex.test(ele[x][y])) {
              return "pincode isn't valid";
            }
            ele[x][y] = parseInt(ele[x][y]);
            return;
          }
          if (typeof ele[x][y] != "string") {
            return `${y} in ${x} address must be a string`;
          }
          ele[x][y] = ele[x][y].trim();
          if (ele[x][y].length == 0) {
            return `${y} in ${x} address can't be empty`;
          }
        })
        .find((x) => x != undefined);
    })
    .find((x) => x != undefined);

  if (error) return error;
}

function updateUser(body) {
  if (JSON.stringify(body) == "{}") return "request body cannot be empty";
  let invalidKey = 0;
  let error = userFields
    .map((x) => {
      if (x in body) {
        invalidKey++
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
      } 
      return false;
    })
    .find((x) => x != undefined && x != false);

  if (error) return error;
  if (!invalidKey) return "The data sent you is invalid";
}

function updateAdress(body) {
  try {
    if (
      !(
        typeof body["address"] == "object" &&
        Array.isArray(body["address"]) != true &&
        body["address"] != null
      )
    ) {
      return `address must be an object`;
    }
    if (!("shipping" in body["address"] || "billing" in body["address"])) {
      return `either shipping or billing address is required for update`;
    }
    let fields = ["shipping", "billing"];
    let error = fields
      .map((x) => {
        if (x in body["address"]) {
          if (
            !(
              typeof body["address"][x] == "object" &&
              Array.isArray(body["address"][x]) != true &&
              body["address"][x] != null
            )
          ) {
            return `${x} address must be an object`;
          }
          if (
            !(
              "city" in body["address"][x] ||
              "street" in body["address"][x] ||
              "pincode" in body["address"][x]
            )
          ) {
            return `${x} address needs to have atleast one valid thing to update; city, street, pincode`;
          }
          if ("city" in body["address"][x]) {
            if (typeof body["address"][x]["city"] != "string") {
              return ` city in ${x} address should be a string`;
            }
            body["address"][x]["city"] = body["address"][x]["city"].trim();
            if (!body["address"][x]["city"].length) {
              return ` city in ${x} address can't be empty`;
            }
            body[`address.${x}.city`] = body["address"][x]["city"];
          }
          if ("street" in body["address"][x]) {
            if (typeof body["address"][x]["street"] != "string") {
              return ` street in ${x} address should be a string`;
            }
            body["address"][x]["street"] = body["address"][x]["street"].trim();
            if (!body["address"][x]["street"].length) {
              return ` street in ${x} address can't be empty`;
            }
            body[`address.${x}.street`] = body["address"][x]["street"];
          }
          if ("pincode" in body["address"][x]) {
            if (!pinRegex.test(body["address"][x]["pincode"])) {
              return ` pincode in ${x} address isn't valid`;
            }
            body[`address.${x}.pincode`] = parseInt(
              body["address"][x]["pincode"]
            );
          }
        }
      })
      .find((x) => x != undefined);
    if (error) return error;
    delete body["address"]
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
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
        body[x] = Number(body[x]);
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
  if (JSON.stringify(query) == "{}") return;

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
    query["$and"] = [{ price: { $gte: query["priceGreaterThan"] } }];
    delete query["priceGreaterThan"];
  }
  if ("priceLessThan" in query) {
    if (!positive.test(query["priceLessThan"])) {
      return "priceLessThan must be a natural number";
    }
    if (query["priceLessThan"] == 0) {
      return "priceLessThan filter must be greater than zero";
    }
    if (!query["$and"]) {
      query["$and"] = [{ price: { $lte: query["priceLessThan"] } }];
      delete query["priceLessThan"];
    } else {
      query["$and"].push({ price: { $lte: query["priceLessThan"] } });
      delete query["priceLessThan"];
    }
  }
  if ("priceSort" in query) {
    if (!(query["priceSort"] == 1 || query["priceSort"] == -1)) {
      return "priceSort filter should be a number equal to 1 or -1";
    }
  }
}

function updateProduct(body) {
  if (JSON.stringify(body) == "{}") return "request body cannot be empty";

  body["currencyFormat"] = "₹";
  let check = 0;

  if ("style" in body) productFields.push("style");

  let error = productFields
    .map((x) => {
      if (x in body) {
        check++;

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
          body[x] = Number(body[x]);
          return;
        }

        if (typeof body[x] != "string") return `${x} should must be a string`;

        body[x] = body[x].trim();
        let key = body[x];

        if (!key.length) return `${x} can't be empty`;

        if (x == "currencyId") {
          if (body[x] != "INR") return `${x} must be in "INR" format`;
        }
      }
    })
    .find((x) => x != undefined);

  if (error) return error;

  if ("availableSizes" in body) {
    if (!body["availableSizes"].length) {
      return "availableSizes array can't be empty";
    }
    let len = body["availableSizes"].length;

    for (let i = len - 1; i >= 0; i--) {
      if (!productSize.includes(body["availableSizes"][i])) {
        body["availableSizes"].splice(i, 1);
      }
    }

    if (!body["availableSizes"].length) {
      return "availableSizes array doesn't have any valid size";
    }
    body["$addToSet"] = { availableSizes: { $each: body["availableSizes"] } };
    delete body["availableSizes"];
    check++;
  }
  if ("isFreeShipping" in body) {
    if (typeof body["isFreeShipping"] != "boolean") {
      return `isFreeShipping must be a boolean value`;
    }
    check++;
  }
  if ("installments" in body) {
    if (typeof body["installments"] != "number") {
      return "installments must be a number";
    }
    if (body["installments"] <= 0) {
      return "installments must be greater than zero";
    }
    if (!positive.test(body["installments"])) {
      return "installment count must be a natural number";
    }
    check++;
  }
  if (!check) {
    return "The data you sent isn't valid";
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

function createCart(body) {
  if (JSON.stringify(body) == "{}") {
    return "cartBody can't be empty";
  }
  if (!("productId" in body)) {
    return "productId is required to create a cart";
  }
  if (!id(body["productId"])) {
    return `productId in request body isn't valid`;
  }
  if (!("quantity" in body)) {
    return `quantity of the product is required`;
  }
  if (typeof body["quantity"] != "number") {
    return `quantity of the item is not a number`;
  }
  if (body["quantity"] > 0) {
    if (!positive.test(body["quantity"])) {
      return "quantity of a product can't be in decimals";
    }
  } else {
    return `quantity of the product has to be a positive number`;
  }
  if ("cartId" in body) {
    if (!id(body["cartId"])) {
      return `cartId in request body isn't valid`;
    }
  }
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
  getProducts,
  updateProduct,
  address,
  createCart,
  updateAdress,
};

// Saved for later

// if (!("items" in body)) {
//   return `items is missing in cartBody`;
// }
// if (!Array.isArray(body["items"])) {
//   return "items in request body has to be an array";
// }
// if (body["items"].length == 0) {
//   return "please add some items to create a cart";
// }

// let len = body["items"].length - 1;

// function checkObject(ele) {
//   if (typeof ele == "object" && Array.isArray(ele) != true && ele != null) {
//     return true;
//   }
//   return false;
// }
// body["products"] = {};

// for (let i = len; i >= 0; i--) {
//   let item = body["items"][i];

//   if (checkObject(item)) {
//     if (!("productId" in item)) {
//       return `productId is missing in the item at index ${i}`;
//     }
//     if (!id(item["productId"])) {
//       return `productId of the item at index ${i} is not valid`;
//     }
//     if (!("quantity" in item)) {
//       return `quantity is missing in item at index ${i}`;
//     }
//     if (typeof item["quantity"] != "number") {
//       return `quantity of item at index ${i} is not a number`;
//     }
//     if (item["quantity"] > 0) {
//       if (!positive.test(item["quantity"])) {
//         return `quantity of item at index ${i} can't be in decimals`;
//       }
//       if (item["productId"] in body["products"]) {
//         body["products"][item["productId"]] += item["quantity"];
//       } else {
//         body["products"][item["productId"]] = item["quantity"];
//       }
//     } else {
//       return `quantity of item at index ${i} has to be a positive number`;
//     }
//   }
// }
// if (!Object.keys(body["products"].length)) {
//   return "the format of the product isn't valid";
// }
// delete body["items"];

// /* DON'T FOCUS ON THIS LINE FOR NOW
// let result  = Object.keys(body["products"])

// return await  cartModel.find({$in:{_id:result},isDeleted:false})

// if(!output.length){
//   return "no products with these id or already deleted"
// }
// */
