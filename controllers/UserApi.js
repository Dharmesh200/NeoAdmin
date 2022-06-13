const UserSchema = require("../models/User");

exports.userInfo = async (req, res) => {
    try {
        let { name, email, mobile, age } = req.body;
        let userData = { name, email, mobile, age };
        let storeData = await UserSchema.create(userData);
        res.status(201).json({ message: "User details are stored", storeData });
    }
    catch (err) {
        res.status(500).json({ message: "server error", err });
    }
}

exports.getInfo = async (req, res) => {
    try {
        let allData = await UserSchema.find();
        res.status(200).json({ message: "all the user details", allData });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
}

exports.getOneInfo = async (req, res) => {
    try {
        let onedata = await UserSchema.findById({ _id: req.params.id });
        res.status(200).json({ message: "one user details", onedata });   
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};

exports.userUpdate = async (req, res) => {
    try {
        let { name, mobile, email, age } = req.body;

        let updateData = await UserSchema.findByIdAndUpdate(req.params.id, {
            name,
            mobile,
            email,
            age
        }, { new: true });
        await updateData.save();
        res.status(200).json({ message: "user updated", updateData })

    }
    catch (err) {
        res.status(500).json({ message: "server error" }, err);
        console.log(err);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        let payload = await UserSchema.deleteOne({ _id: req.params.id });
        res
            .status(200)
            .json({ message: "successfully deleted user", payload });
    } catch (error) {
        res.status(501).json({ message: "server error" });
    }
};


