import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// token generation using jwt
const createToken = (id) => {
    console.log( process.env.JWT_SECRET_KEY);
    
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY)
}

// for registration
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter correct Email address." })
        }
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Email address already exists." })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password." })
        }

        // encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name, email: email, password: hashedPassword,
        })

        const user = await newUser.save();

        const token = createToken(user._id);

        return res.json({ success: true, token, message: "User registered successfully." })


    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Failed to add user. Please try again." })
    }
}

// for login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter correct Email address." })
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Email address doesn't exist." })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Please enter correct password." })
        }

        const token = createToken(user._id);
        return res.json({ success: true, token, message: "User Logged in successfully." })


    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Failed to fetch user data. Please try again." })
    }
}

export { registerUser, loginUser };