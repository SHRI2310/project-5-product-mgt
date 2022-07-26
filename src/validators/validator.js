const mongoose = require("mongoose");

let userFields = ["fname", "lname", "email", "phone", "password", "address"];
let nameRegex = /^[A-Za-z]+$/;
let cityRegex = /^[A-Za-z ]+$/
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let phoneRegex = /^[6-9]{1}[0-9]{9}$/;
let pinRegex = /^[1-9][0-9]{5}$/

function userKey(body) {
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

function address(ele){

}

module.exports = {
  userKey,
  emailRegex
};
