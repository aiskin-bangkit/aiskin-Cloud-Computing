const { db, app } = require("../config/db");
const bcrypt = require("bcrypt");
const { getDoc, doc, setDoc } = require("firebase/firestore");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Firebase Storage
const storage = getStorage(app);

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

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
      const { name, email, password } = req.body;
      const image_profile = req.file;

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
        // Define storage reference
        const storageRef = ref(
          storage,
          `profile_images/${req.user.id}${Date.now()}${
            image_profile.originalname
          }`
        );

        // Upload the file
        const metadata = {
          contentType: image_profile.mimetype,
        };
        await uploadBytes(storageRef, image_profile.buffer, metadata);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        user.image_profile = downloadURL;
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
  upload,
};