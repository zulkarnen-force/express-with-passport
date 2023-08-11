const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User.js");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const generateToken = require("./utils/jwt.js");

const app = express();

app.use(bodyParser.json());
require("./middleware/passport-jwt.js");

app.post("/register", async (req, res) => {
  try {
    if (!req.body.password) {
      throw new Error("password required");
    }
    let id = uuidv4();
    const user = new User({
      id,
      name: req.body.name,
      nim: req.body.nim,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    await user.save();
    return res.status(201).json({
      result: {
        message: "user registered successfully",
        success: true,
        data: {
          id: user.id,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      errors: {
        message: error.message,
        success: false,
      },
    });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  try {
    if (!req.body.password && !email) {
      throw new Error("password and email is required");
    }
    const user = await User.findOne({ email: email });
    const pwd = user.password;
    const plainPassword = req.body.password;
    const isValidPwd = bcrypt.compareSync(plainPassword, pwd);
    if (!isValidPwd)
      return res
        .status(400)
        .json({ errors: { message: "not valid password" } });
    return res.json({ token: generateToken(user) });
  } catch (error) {
    return res.status(400).json({
      errors: {
        message: error.message,
        success: false,
      },
    });
  }
});

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const users = await User.find({}, { _id: 0, password: 0, __v: 0 });
    return res.json({ data: users });
  }
);

app.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
  return res.json(req.user.payload);
});

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
  mongoose
    .connect("mongodb://127.0.0.1:27017/myDB", {
      autoIndex: true,
    })
    .then((connection) => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log("MongoDB Disconnected", err);
    });
});
