const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateProfileUpdateInput = require("../../validation/profile");

// Load User model
const User = require("../../models/User");
const Token = require("../../models/Token");

const sendEmail = require("../../utils/sendEmail");

const crypto = require("crypto");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(async (user) => {
              const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
              }).save();

              const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

              // await sendEmail(user.email, "Verify Email", url);

              return res.json(user);
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/profile/:id", async (req, res) => {
  // Form validation

  const { errors, isValid } = validateProfileUpdateInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by id
  User.findOne({ _id: req.params.id }).then((user) => {
    // Check if user exists
    if (!user) {
      console.log("##### user not found");

      return res.status(404).json({ errpr: "User not found" });
    }
    console.log("##### user found");

    console.log("##### received req.body", req.body);

    user.name = req.body?.name;
    user.nationality = req.body?.nationality;
    user.photo_url = req.body?.photo_url;
    user.birthdate = req.body?.birthdate;
    user.marital_status = req.body?.marital_status;
    user.age = req.body?.age;
    user.id_number = req.body?.id_number;

    user
      .save()
      .then((data) =>
        res.status(200).json({
          message: "User profile updated successfully",
          data,
        })
      )
      .catch((err) =>
        res.status(500).json({ error: "Server error: " + err.message })
      );
  });
});

// @desc Verify user token
// @access Public
router.get("/:id/verify/:token/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user)
      return res
        .status(400)
        .send({ message: "Link provided is invalid or might have expired" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res
        .status(400)
        .send({ message: "Link provided is invalid or might have expired" });

    await User.updateOne({ _id: user._id, email_verified: true });
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    console.log("##### req.body not valid");
    return res.status(400).json(errors);
  }
  console.log("##### req.body  valid");

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      console.log("##### user not found");

      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    console.log("##### user found");

    // Check password
    bcrypt.compare(password, user.password).then(async (isMatch) => {
      if (isMatch) {
        // User matched
        console.log("##### user matched with password", user);

        // if (!user.email_verified) {
        //   let token = await Token.findOne({ userId: user._id });
        //   console.log("##### found user token", token);

        //   if (!token) {
        //     console.log("##### no user token found", token);
        //     token = await new Token({
        //       userId: user._id,
        //       token: crypto.randomBytes(32).toString("hex"),
        //     }).save();
        //   }

        //   const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        //   await sendEmail(user.email, "Verify Email", url);

        //   return res.status(400).json({
        //     message:
        //       "A verification email was sent to your account please verify",
        //   });
        // }

        // Create JWT Payload
        const payload = {
          id: user._id,
          name: user.name,
          nationality: user.nationality,
          birthdate: user.birthdate,
          id_number: user.id_number,
          marital_status: user.marital_status,
          account_status: user.account_status,
          age: user.age,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.SECRET,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
