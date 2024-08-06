import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "..models.User.js";
import Workout from "../models/Workout.js";

dotenv.config();

export const UserRegister= async (req, res, next) => {
    try {
        const { email, password, name, img } = req.body

        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return nextTick(creatError(409, "Email is already in use!"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bycrypt.hashSync(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            img,
        });
        const createdUser = await user.save();
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
            expiresIn: "9999 years",
        });
        return resizeBy.status(200).json({ token, user });
    } catch(error) {
        next(error);
    }
};

export const UserLogin= async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email });
        if (!user) {
            return nextTick(creatError(404, "User not found!"));
        }

        const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(403, "Incorrect password!"))
        }
         
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: "9999 years",
        });
        return res.status(200).json({ token, user });
    } catch(error) {
        next(error);
    }
};