const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Token generation using jwt
const createToken = (id) => {
    console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

// 📝 Register User
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "📧 Hmm... That doesn't look like a valid email. Please double-check it!",
            });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({
                success: false,
                message: "😕 Oh snap! This email is already in use. Try logging in instead.",
            });
        }

        if (!password || password.length < 8) {
            return res.json({
                success: false,
                message: "🔐 Password must be at least 8 characters long. Make it strong and secure!",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({
            success: true,
            token,
            message: "🎉 Woohoo! You’ve successfully registered. Welcome aboard! 🚀",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.json({
            success: false,
            message: "😓 Oops! Something went wrong while registering. Please try again later.",
        });
    }
};

// 🔑 Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "📧 Please enter a valid email address. We want to reach you! 😉",
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "😟 No user found with this email. Are you sure you registered?",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "🙈 Oops! That password doesn’t match. Double-check and try again.",
            });
        }

        const token = createToken(user._id);
        return res.json({
            success: true,
            token,
            message: "💫 Logged in successfully! Great to see you again. 😊",
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.json({
            success: false,
            message: "😵 Uh-oh! Couldn’t log you in right now. Please try again shortly.",
        });
    }
};

module.exports = { registerUser, loginUser };
