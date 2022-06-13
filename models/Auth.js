const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserAuthSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,

  },
  role: {
    type: String,
    enum: ["admin"],
    required: true,
  },
});
UserAuthSchema.pre("save", async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

UserAuthSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, "NeoKred", {
    expiresIn: "1h",
  });
};

module.exports = model("Authentication", UserAuthSchema);
