const express = require("express");
const { body, validationResult,  } = require("express-validator");

const Validator = (req, res, next) => {
  console.log(req.body);
  const input = JSON.parse(req.body.json);
  req.body = input;


  body("title", "enter a valid title").not().isEmpty();
  body("description", "description must be atleast 4 characters").isLength(
    {
      min: 4,
    }
  );
  body("price", "offering Amount must be greater than zero").isFloat({
    min: 0,
  });
  body(
    "isRental",
    "make rental true or false depending on your listing"
  ).isBoolean();
  next();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};
module.exports=Validator;
