import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../db/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import db from "../db/db.js"; // MySQL Database Connection
import { ApiError } from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js"; // Assuming ApiResponse is created for better structure
import { uploadfileOnCloudinary } from "../utils/cloudinary.js";

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
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
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
    const { name, email, password ,role} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Insert the user and OTP
    await db.execute(
      "INSERT INTO users (name, email, password, otp, otp_expires,role) VALUES (?, ?, ?, ?, ?,?)",
      [name, email, hashedPassword, otp, otpExpires,role ||"user"]
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

    const newUser=await db.execute(
      "UPDATE users SET otp = NULL, otp_expires = NULL, verified = 1 WHERE email = ?",
      [email]
    );
return res.status(200).json({
  success: true,
  message: "Email verified successfully",
  user: { email: user[0].email, verified: true }, // Return user data
});

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ Login Function

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate that at least one of email or username is provided
    if (!username && !email) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        data: null,
        errors: ["Username or email is required"],
      });
    }

    // Prepare the query parameters
    const queryParams = [];
    let queryString = "SELECT * FROM users WHERE";

    if (email) {
      queryString += " email = ?";
      queryParams.push(email);
    }

    if (username) {
      if (email) {
        queryString += " OR";
      }
      queryString += " username = ?";
      queryParams.push(username);
    }

    // Query to find the user by either email or username
    const [user] = await db.execute(queryString, queryParams);

    // Check if user exists
    if (user.length === 0) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        data: null,
        errors: ["User not found"],
      });
    }

    const { user_id, name, password: hashedPassword, verified,role } = user[0];

    // Check if the user's email is verified
    if (!verified) {
      return res.status(403).json({
        statusCode: 403,
        success: false,
        data: null,
        errors: ["Verify your email before logging in"],
      });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        data: null,
        errors: ["Invalid credentials"],
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user_id);

    // Update the refresh token in the database
    await db.execute("UPDATE users SET refreshToken=?,accessToken=? WHERE user_id = ?", [
      refreshToken,
     accessToken,
      user_id,
    ]);

    // Prepare the response object
    const loggedUser = {
      user_id,
      name,
      email: user[0].email, // Add other fields you want in the response
    };

    // Cookie options for tokens
    const options = {
      httpOnly: true,
      secure: true, // Ensure this is set to true if you're using HTTPS
    };

    // Return the response with status 200, cookies, and formatted data
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        statusCode: 200,
        success: true,
        data: {
          user: loggedUser,
          role:role,
          refreshToken,
          accessToken,
          message: "Logged in successfully",
        },
        errors: [],
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      data: null,
      errors: ["Server error"],
    });
  }
};




// ✅ Logout Function
export const logout = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }

    // Remove the refresh_token from the database
    const [result] = await pool.query(
      "UPDATE users SET refreshToken = NULL WHERE user_id = ?",
      [user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or already logged out",
      });
    }

    // Clear cookies
    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



export const currentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Find Successfully"));
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

    console.log((otp))
    if (new Date() > new Date(otp_expires)) {
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }
    console.log(typeof(storedOTP))
    if (storedOTP != parseInt(otp)) {
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

// Generate Access and Refresh Tokens
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


export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user_id = req.params.id;
    console.log("Deleting user with ID:", user_id); // Debugging

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const [result] = await db.execute("DELETE FROM users WHERE user_id=?", [
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export  const editProfile = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user?.user_id; // Ensure this is properly extracted
    if (!user_id) {
      return res
        .status(400)
        .json({ message: "User ID is missing from request" });
    }
    console.log("Uploaded files:", req.files); // Log files to verify the upload

    const { name, location, bio } = req.body;
    let avtar = req.files?.profile_pic?.[0]?.path; // Check if file exists

    let profile_pic = null;

    // Upload image only if provided
    if (avtar) {
      profile_pic = await uploadfileOnCloudinary(avtar); // Upload the avatar to Cloudinary
      if (!profile_pic) {
        throw new ApiError(400, "Failed to upload avatar");
      }
    }

    console.log("Profile Picture URL:", profile_pic?.url); // Debugging the profile_pic URL

    // Check if any field is provided
    if (!name && !location && !bio && !avtar) {
      return res
        .status(400)
        .json({ message: "At least one field must be provided for update" });
    }

    // Prepare the profile_pic URL or null if not provided
    const profile_pic_url = profile_pic ? profile_pic.url : null;

    // Prepare SQL query
    const query = `UPDATE users SET 
                      name = COALESCE(?, name), 
                      location = COALESCE(?, location), 
                      bio = COALESCE(?, bio), 
                      profile_pic = COALESCE(?, profile_pic),
                      updated_at = CURRENT_TIMESTAMP
                      WHERE user_id = ?`;

    const values = [
      name ?? null, // Convert undefined to null
      location ?? null,
      bio ?? null,
      profile_pic_url, // Use the URL if the profile_pic was uploaded
      user_id ?? null, // Ensure user_id is never undefined
    ];

    console.log("SQL Query Values:", values); // Debugging

    // Execute the SQL query
    const [result] = await db.execute(query, values);

    // Check if the user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
