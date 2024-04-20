const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

// Import the node-cache package
const NodeCache = require("node-cache");

// Initialize a new instance of NodeCache
const cache = new NodeCache();
const MAIL_ID = process.env.MAIL_ID;
const MAIL_PASS = process.env.MAIL_PASS;
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: MAIL_ID,
    pass: MAIL_PASS,
  },
});

const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE-1 //create a user - POST - "/api/auth/createuser " - DOES NOT REQUIRE LOGIN
router.post(
  "/createuser",
  [
    // checking input given by the user using express validator
    body("email", "enter a valild email address").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("name", "name must be atleast 2 characters").isLength({ min: 2 }),
    body("role", "invalid role").isIn(["User", "Admin", "Owner", "Manager"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if validation fails return errors and do not continue forward
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // search if a user for that email already exists
    User.findOne({ email: req.body.email }, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ errors: "Internal server error" });
      } else {
        // if no result found then create a new one
        if (!result) {
          // use bcrypt to genrate a hash
          bcrypt.hash(req.body.password, 10, async function (error, hash) {
            if (error) {
              console.log(error);
              res.status(400).json({ errors: "Internal server error" });
            } else {
              // save the user in database
              let user = await User.create({
                email: req.body.email,
                name: req.body.name,
                role: req.body.role,
                password: hash,
              });

              const data = {
                user: {
                  id: user.id,
                },
              };

              // generating authorization token using jwt and sending it to user
              const authtoken = jwt.sign(data, JWT_SECRET);

              res.json({ authtoken });
            }
          });
        } else {
          // if a result was found then user already exists and return error
          return res.status(400).json({ error: "Email already in use" });
        }
      }
    });
  }
);

// ROUTE-2 //verify a user - POST - "/api/auth/login " - DOES NOT REQUIRE LOGIN
router.post(
  "/login",
  [
    // checking input given by the user using express validator
    body("email", "enter a valild email address").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if validation fails return errors and do not continue forward
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      // find user with provided email
      User.findOne({ email: req.body.email }, async function (err, foundUser) {
        if (err) {
          console.log(err);
          return res.status(400).json({ errors: "Internal server error" });
        } else {
          // if not found any user return error
          if (!foundUser) {
            return res
              .status(400)
              .json({ errors: "Login with valid credentials" });
          } else {
            // if user is found
            // compare the password provided and the hash stored in our database
            const result = await bcrypt.compare(
              req.body.password,
              foundUser.password
            );
            if (result === false) {
              return res
                .status(400)
                .json({ errors: "Login with valid credentials" });
            } else if (result === true) {
              // if passwords match then give the user an auth token
              const data = {
                user: {
                  id: foundUser.id,
                },
              };

              // generating authorization token using jwt and sending it to user
              const authtoken = jwt.sign(data, JWT_SECRET);

              //  return the found user name and authtoken
              res.json({
                authtoken: authtoken,
                name: foundUser.name,
                role: foundUser.role,
              });
            }
          }
        }
      });
    }
  }
);

// ROUTE-3 //get logged in users details - POST - "/api/auth/getuser " -  REQUIRES LOGIN
router.post(
  "/getuser",
  // using the fetch user middle ware
  fetchuser,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ errors: "Error occoured" });
    }
  }
);

// ROUTE-4 //get all users details - GET - "/api/auth/getalluser " - DOES NOT REQUIRE LOGIN
router.get("/getalluser", async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errors: "Error occoured" });
  }
});

// ROUTE-5 //update a user - PUT - "/api/auth/updateuser " - REQUIRES LOGIN
router.put("/updateuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's name if not empty
    if (name && name.trim() !== "") {
      user.name = name;
    }

    // Update the user's password if not empty
    if (password && password.trim() !== "") {
      // Generate a hash for the new password
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }

    // Save the updated user
    await user.save();

    res.json({ name: user.name, role: user.role, email: user.email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//TEMP ROUTE TO CHECK EMAIL SENDING FUNCTIONALITY
// Backend endpoint to send a "hi" message to an email address
router.post("/sendHi", async (req, res) => {
  try {
    const { email } = req.body;
    // Send "hi" message via email
    const mailOptions = {
      from: "guptanishit.2626@gmail.com",
      to: email,
      subject: "Hi from Temporary API",
      text: "Hi, this is a test message from the Temporary API.",
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully"); // Add logging
    res.json({ success: true, message: "Hi message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error); // Log detailed error
    res.status(500).json({ error });
  }
});

// ROUTE-6 //generate and send OTP - POST - "/api/auth/generateOTP "
router.post("/generateOTP", async (req, res) => {
  const { email } = req.body;
  const OTP = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    alphabets: false,
    specialChars: false,
  });
  // Store OTP in cache or database
  cache.set(email, OTP);
  // Send OTP via email
  const mailOptions = {
    from: MAIL_ID,
    to: email,
    subject: "OTP for registration on SmartPark",
    text: `Your OTP for registration is: ${OTP}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to send OTP" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ success: true });
    }
  });
});

// ROUTE-7 //generate and send OTP - POST - "/api/auth/verifyOTP "
router.post("/verifyOTP", async (req, res) => {
  const { email, enteredOTP } = req.body;
  const storedOTP = cache.get(email);
  if (storedOTP === enteredOTP) {
    // OTP matched, proceed with registration
    // Clear OTP from cache
    cache.del(email);
    // Register user or perform necessary actions
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

module.exports = router;
