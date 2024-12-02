const { db } = require("../config/db");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const statusCode = require('../util/response').httpStatus_keyValue
const {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  query,
} = require("firebase/firestore");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


// User Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Email and password are required",
      });
    }

    // Query to find user by email
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({
        status: "failed",
        message: "Email not found",
      });
    }

    let userData;
    let userId;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
      userId = doc.id;
    });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: userId, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    // Respond with the token
    res.status(200).json({
      status: "success",
      message: "User signed in successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "User sign-in failed",
      error: error.message,
    });
    console.log(error);
  }
};

// User Sign Up
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Name, email, and password are required",
      });
    }

    const q = query(collection(db, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(400).json({
        status: "failed",
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(email, hashedPassword, name);

    const docRef = await addDoc(collection(db, "users"), newUser.toJSON());

    res.status(201).json({
      status: "success",
      message: `User signed up successfully, users written with ID: ${docRef.id}`,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "User sign-up failed",
      error: error.message,
    });
    console.log(error);
  }
};


const logout = async (req, res, next) => {
  try {
    // Ensure req.userId is defined before accessing Firestore
    if (!req.user) {
      return res.status(400).json({
        status: "failed",
        message: "User is required"
      });
    }

    // Retrieve the user document reference using req.userId
    const userDocRef = doc(db, 'users', req.userId);

    const userSnapshot = await getDoc(userDocRef);
    if (!userSnapshot.exists()) {
      const err = new Error('Auth Error, Failed Logout');
      err.statusCode = statusCode['401_unauthorized'];
      throw err;
    }
    res.status(statusCode['200_ok']).json({
      errors: false,
      message: 'Log Out Success!',
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = statusCode['500_internal_server_error'];
    }
    next(e);
  }
};

module.exports = {
  signIn,
  signUp,
  logout,
};
