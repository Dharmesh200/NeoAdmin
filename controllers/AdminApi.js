const UserAuthSchema = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        let { email, user_name, password, confirmPassword, role } = req.body;
        let regData = { email, user_name, password, confirmPassword, role };
        let data = await UserAuthSchema.create(regData);
        //   res.status(201).json({ message: "successfully registered", data });
        sendTokenToClient(data, 201, res);
    } catch (error) {
        res.status(501).json({ message: "server error" });
    }
};

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(205)
                .json({ message: "email and password is required" });
        }

        let data = await UserAuthSchema.findOne({ email }).select("+password");

        if (!data) {
            return res.status(401).json({ message: "user does not exist" });
        }
        let ismatch = await bcrypt.compare(password, data.password);
        if (!ismatch) {
            return res.status(401).json({ message: "password does not match" });
        }
        sendTokenToClient(data, 201, res);
    } catch (err) {
        res.status(500).json({ message: "server error", err });
    }
};

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
        let decoded = await jwt.verify(token, "NeoKred");
        req.user = decoded;
        next();
    }

    catch (err) {
        next(res.status(400).json({ message: "you are not authorized user", err }));
    }
}

exports.authorizeAdmin = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(
                res.status(401).json({ message: `${req.user.role} is not authorised` })
            );
        }
        else if (role.includes(req.user.role)) {
            return next();
        }
        else {
            return next(res.status(401).json({ message: "no access" }))

        }
    };
}

