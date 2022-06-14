const { Schema, model } = require("mongoose");
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        enum:['user'],
        required: true,
    },
    email: {
        type:String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id, mobile: this.mobile }, "user", {
      expiresIn: "1h",
    });
  };

module.exports = model("userData", UserSchema);

