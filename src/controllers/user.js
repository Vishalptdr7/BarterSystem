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
// Generate access token and refreshtoken

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    console.log("Generating tokens for User ID:", userId);

    // Fetch user from MySQL
    const [users] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      console.log("User not found");
      throw new Error("User Not Found!");
    }

    const user = users[0];

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Generated Access Token:", accessToken);
    console.log("Generated Refresh Token:", refreshToken);

    // Update refresh token in database
    await db.execute("UPDATE users SET refreshToken = ? WHERE user_id = ?", [
      refreshToken,
      user.user_id,
    ]);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw error;
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
    console.log("Received OTP:", otp); // Debugging

    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    const { otp: storedOTP, otp_expires } = user[0];

    console.log("Stored OTP:", storedOTP); // Debugging

    if (!storedOTP) {
      return res
        .status(400)
        .json({ message: "No OTP found. Request a new one." });
    }

    if (new Date() > new Date(otp_expires)) {
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }

    if (storedOTP.trim() !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await db.execute(
      "UPDATE users SET otp = NULL, otp_expires = NULL, verified = 1 WHERE email = ?",
      [email]
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error:", error);
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

    if (user.length === 0) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user[0]); // Debug user object

    const { user_id, name, password: hashedPassword, verified } = user[0];

    if (!verified) {
      return res
        .status(403)
        .json({ message: "Verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User ID from database:", user_id); // Debug ID before token generation

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user_id);

    console.log("Generated Tokens:", accessToken, refreshToken); // Debugging

    // Store refresh token in DB
    await db.execute("UPDATE users SET refreshToken = ? WHERE user_id = ?", [
      refreshToken,
      user_id,
    ]);

    // Send response
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Logout Function
export const logout = asyncHandler(async (req, res) => {
  const userId = await req.user.id; // Extract user ID from the request (populated by verifyJWT)

  try {
    // Remove the access_token and refresh_token from the database
    const [result] = await pool.query(
      "UPDATE users SET access_token = NULL, refresh_token = NULL WHERE id = ?",
      [userId]
    );

    // Check if the update was successful
    if (result.affectedRows === 0) {
      throw new ApiError(404, "User not found or already logged out");
    }

    // Clear cookies by setting options for secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
      sameSite: "Strict",
    };

    // Clear the cookies from the response
    res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



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


