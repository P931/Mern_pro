const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: "FirstName is required",
    trim: true,
  },
  LastName: {
    trim: true,
    type: String,
    required: "LastName is required",
  },
  Email: {
    type: String,
    required: [true, "Email is required, Cannot create user without email "],
    unique: [true, "email already exists in database!"],
    trim: true,
    lowercase: true,
    max: 50,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  Mobile: {
    type: Number,
    required: "Mobile is required",
    unique: [true, "Mobile number is already exists in database!"],
    trim: true,
    // validate: {
    //   validator: function (v) {
    //     return /^[0-9]{10}/.test(v);
    //   },
    //   message: '{VALUE} is not a valid 10 digit number!'
    // }
  },
  Gender: {
    type: String,
    required: "Gender is required",
  },
  Status: {
    type: String,
    required: "Status is required",
  },
  Profile: {
    type: String,
    required: "Profile is required",
  },
  Location: {
    type: String,
    required: "Location is required",
    trim: true,
    maxLength: 100
  }

})

const user = mongoose.model("user", userSchema)

module.exports = user