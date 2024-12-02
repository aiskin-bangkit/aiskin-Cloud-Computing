const { db } = require("../config/db");
const {
  getDoc,
  doc,
  addDoc,
  getDocs,
  query,
  Timestamp,
  collection,
  where,
} = require("firebase/firestore");

// User History to Db
const history = async (req, res) => {
  try {
    const { disease_name, percentage, image, other_suggestion } = req.body;

    const user_id = req.user.id;
    const created_at = Timestamp.now();
    const newHistory = {
      disease_name,
      percentage,
      image,
      created_at,
      other_suggestion,
      user_id,
    };

    const docRef = await addDoc(
      collection(db, "diagnosed_history"),
      newHistory
    );

    res.status(201).json({
      status: "success",
      message: `User history successfully, users written with ID: ${docRef.id}`,
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

const getHistoryByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId)
    const predictionRef = collection(db, "diagnosed_history");
    const q = query(predictionRef, where("user_id", "==", userId));
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
    console.log(predictions)
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to get prediction history",
      error: error.message,
    });
  }
};

// const getHistoryById = async (req, res) => {
//   try {
//     const predictionId = req.params.id;
//     const predictionRef = doc(db, "prediction_result", predictionId);
//     const predictionSnap = await getDoc(predictionRef);
// 
//     if (!predictionSnap.exists()) {
//       return res.status(404).json({
//         status: "failed",
//         message: "Prediction history not found",
//       });
//     }
// 
//     const prediction = predictionSnap.data();
//     res.status(200).json({
//       status: "success",
//       data: prediction,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "failed",
//       message: "Failed to get prediction history",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  history,
  getHistoryByUser,
//  getHistoryById,
};
