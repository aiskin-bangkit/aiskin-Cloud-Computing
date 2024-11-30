const { db } = require("../config/db");
const {
  getDoc,
  doc,
  getDocs,
  query,
  collection,
  where,
} = require("firebase/firestore");

const Predict = async (req, res) => {
  try {
    const userRef = doc(db, "users", req.user.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { user_id, image } = req.body;

      if (!user_id || !image) {
        return res.status(400).json({
          status: "failed",
          message: "Please provide user_id and image",
        });
      }
    }

    // Predict image here
    // CODE HERE
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to predict image",
      error: error.message,
    });
  }
};

const getPredictionHistoryByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const predictionRef = collection(db, "prediction_result");
    const q = query(predictionRef, where("user_Id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({
        status: "failed",
        message: "No prediction history found for this user",
      });
    }

    const predictions = [];
    querySnapshot.forEach((doc) => {
      predictions.push(doc.data());
    });

    res.status(200).json({
      status: "success",
      data: predictions,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to get prediction history",
      error: error.message,
    });
  }
};

const getPredictionHistoryById = async (req, res) => {
  try {
    const predictionId = req.params.id;
    const predictionRef = doc(db, "prediction_result", predictionId);
    const predictionSnap = await getDoc(predictionRef);

    if (!predictionSnap.exists()) {
      return res.status(404).json({
        status: "failed",
        message: "Prediction history not found",
      });
    }

    const prediction = predictionSnap.data();
    res.status(200).json({
      status: "success",
      data: prediction,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to get prediction history",
      error: error.message,
    });
  }
};

module.exports = {
  Predict,
  getPredictionHistoryByUser,
  getPredictionHistoryById,
};
