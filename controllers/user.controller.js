const { db } = require("../config/db");
const bcrypt = require("bcrypt");
const { getDoc, doc, setDoc } = require("firebase/firestore");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const getUserProfile = async (req, res) => {
  try {
    const userRef = doc(db, "users", req.user.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();
      delete user.password;
      res.json({
        status: "success",
        message: "User profile found",
        data: {
          id: req.user.id,
          name: user.name,
          email: user.email,
          image_profile: user.image_profile || null,
        },
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "User profile not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userRef = doc(db, "users", req.user.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();
      const { name, email, password, image_profile } = req.body;

      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      if (image_profile) {
        user.image_profile = image_profile;
      }

      await setDoc(userRef, user);

      const newToken = jwt.sign(
        {
          id: req.user.id,
          email: user.email,
        },
        process.env.JWT_SECRET
      );

      res.json({
        status: "success",
        message: "User profile updated",
        data: {
          id: req.user.id,
          name: user.name,
          email: user.email,
          image_profile: user.image_profile || null,
          token: newToken,
        },
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "User profile not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
