const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
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

module.exports = model("userData", UserSchema);

