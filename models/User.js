const mongoose = require("mongoose");
const schema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,

    required: [true, "Email required"],
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", schema);
module.exports = User;
