import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import db from "../db/db.js"; // MySQL Database Connection
import { ApiError } from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js"; // Assuming ApiResponse is created for better structure

dotenv.config();

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP email");
  }
};

// Generate access token and refresh token for a user
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    // Fetch user from MySQL
    const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      throw new ApiError(404, "User Not Found!");
    }

    const user = users[0];

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Update refresh token in database
    await db.execute("UPDATE users SET refreshToken = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

// ✅ Register Function
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Insert the user and OTP
    await db.execute(
      "INSERT INTO users (name, email, password, otp, otp_expires) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, otp, otpExpires]
    );

    // Send OTP email
    await sendOTP(email, otp);

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Verify OTP Function
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    const { otp: storedOTP, otp_expires } = user[0];

    if (new Date() > new Date(otp_expires)) {
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }

    if (storedOTP !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await db.execute(
      "UPDATE users SET otp = NULL, otp_expires = NULL, verified = 1 WHERE email = ?",
      [email]
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login Function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0)
      return res.status(404).json({ message: "Invalid email or password" });

    const { id, name, password: hashedPassword, verified } = user[0];

    if (!verified)
      return res
        .status(403)
        .json({ message: "Verify your email before logging in" });

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout Function
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// ✅ Forgot Password (Send OTP for Reset)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await db.execute(
      "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?",
      [otp, otpExpires, email]
    );
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reset Password Function
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    const { otp: storedOTP, otp_expires } = user[0];

    if (new Date() > new Date(otp_expires)) {
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }

    if (storedOTP !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password = ?, otp = NULL, otp_expires = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is required");
  }

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const userId = decodedToken._id;

    // Fetch user from MySQL
    const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (users.length === 0) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const user = users[0];

    // Check if refresh token matches
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh Token has expired");
    }

    // Generate new tokens
    const { accessToken, newrefreshToken } =
      await generateAccessTokenAndRefreshToken(user.id);

    // Update new refresh token in the database
    await db.execute("UPDATE users SET refreshToken = ? WHERE id = ?", [
      newrefreshToken,
      user.id,
    ]);

    // Remove sensitive data before returning user info
    const loggedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(200, {
          user: loggedUser,
          refreshToken: newrefreshToken,
          accessToken,
          message: "Logged in successfully",
        })
      );
  } catch (error) {
    throw new ApiError(401, "Refresh Token has expired");
  }
});


