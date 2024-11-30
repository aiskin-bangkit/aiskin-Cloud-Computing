const { db } = require("../config/db");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const {
  collection,
  addDoc,
  getDocs,
  where,
  query,
} = require("firebase/firestore");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Email and password are required",
      });
    }

    const q = query(collection(db, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({
        status: "failed",
        message: "email not found",
      });
    }

    let userData;
    let userId;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
      userId = doc.id;
    });

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: userId, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

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

    // Hash the password
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

module.exports = {
  signIn,
  signUp,
};
