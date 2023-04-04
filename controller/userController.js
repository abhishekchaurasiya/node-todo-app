const User = require("../models/userModel")
const Joi = require("joi");
const bcrypt = require("bcrypt")
const sendCookies = require("../utils/features");
const { ErrorHandler } = require("../middlewares/errorHandler");


const register = async (req, res, next) => {

    // Validation ***********************************
    const userSchema = Joi.object({
        name: Joi.string().required().min(3).max(30),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(401).json({ message: error.message })
    }

    const { name, email, password } = req.body;

    // Existing Email ***********************************
    try {
        const matchUser = await User.findOne({ email });
        if (matchUser) return next(new ErrorHandler("This is user is already exists!", 403))
    } catch (error) {
        next(error)
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)

    const user = new User({
        name, email, password: hashedpassword
    });

    try {
        await user.save();
    } catch (error) {
        next(error)
    }
    sendCookies(user, res, "Registered Successfully", 201)
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email }).select("+password");
        const { name } = user;
        const result = name.charAt(0).toUpperCase() + name.slice(1);

        if (!user) return next(new ErrorHandler("Invalid Email and Password", 400))

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) return next(new ErrorHandler("Invalid Email and Password", 400))

        sendCookies(user, res, `Welcome back, ${result}`, 200)
    } catch (error) {
        next(error)
    }
};


const logout = async (req, res, next) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            sameSite: Node_Env === "Development" ? "lax" : "none",
            secure: Node_Env === "Development" ? false : true,
        }).json({
            success: true,
            message: "User Successfully Logout",
            user: req.user,

        });
    } catch (error) {
        next(error)
    }
}


const getMyProfile = (req, res, next) => {
    console.log(req.user)
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login, getMyProfile, logout }