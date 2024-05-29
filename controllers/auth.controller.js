import { z } from 'zod';
import User from '../models/auth.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const signupSchema = z.object({
  userName: z.string(),
  email: z.string(),
  password: z.string(),
});

const signinSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export async function signupController(req, res) {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { userName, email, password } = validatedData;

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user.token = token;
    user.password = undefined; // we dont want to send the password to the frontend

    return res.status(201).json({
      success: true,
      message: 'User signed up successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Error Signing up',
    };
  }
}

export async function signinController(req, res) {
  try {
    const validatedData = signinSchema.parse(req.body);
    const { email, password } = validatedData;

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User don't exists",
      });
    }

    const isMatch = await bcryptjs.compare(password, checkUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: checkUser._id, email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    checkUser.token = token;
    checkUser.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      user: checkUser,
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Error Signing up',
    };
  }
}
