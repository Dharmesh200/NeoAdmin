const UserSchema = require("../models/User");
const jwt  = require('jsonwebtoken');

exports.userInfo = async (req, res) => {
    try {
        let { name, email, mobile, age } = req.body;
        let userData = { name, email, mobile, age };
        let storeData = await UserSchema.create(userData);
        res.status(201).json({ message: "User details are stored", storeData });
        sendTokenToClient(storeData,201,res)
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

function sendTokenToClient(data, statusCode, response) {
    let TOKEN = data.getJWTToken();
    const options = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
    };
    response
        .status(statusCode)
        .cookie("token", TOKEN, options)
        .json({ message: "token stored", TOKEN });
}

exports.AuthorizingRoute = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(res.status(401).json({ message: "Token is not produced" }));
    }

    try {
        let decoded = await jwt.verify(token, "user");
        req.user = decoded;
        next();
    }

    catch (err) {
        next(res.status(400).json({ message: "you are not authorized user", err }));
    }
}

exports.authorizeNumber = (...number) => {
    return (req, res, next) => {
        if (!number.includes(req.user.number)) {
            return next(
                res.status(401).json({ message: `${req.user.number} is not authorised` })
            );
        }
        else if (number.includes(req.user.number)) {
            return next();
        }
        else {
            return next(res.status(401).json({ message: "no access" }))

        }
    };
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


