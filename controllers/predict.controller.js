const { db, app } = require("../config/db");
const {
  getDoc,
  doc,
  where,
  setDoc,
  getDocs,
  query,
  addDoc,
  collection,
  updateDoc,
} = require("firebase/firestore");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const multer = require("multer");
const dotenv = require("dotenv");

// Initialize Firebase Storage
const storage = getStorage(app);

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

const predict = async (req, res) => {
  try {
    const userId = req.user.id;
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        status: "failed",
        message: "Image is required",
      });
    }

    const imageRef = ref(storage, `image_predict/${image.originalname}`);
    const metadata = {
      contentType: image.mimetype,
    };
    await uploadBytes(imageRef, image.buffer, metadata);

    const imageUrl = await getDownloadURL(imageRef);

    const predictData = {
      id: docRef.id,
      user_id: userId,
      image: imageUrl,
      email: req.user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      main_prediction_result: {
        disease: "string",
        accuracy: "int/float",
        description: "string",
      },
      other_prediction_result: [
        {
          disease: "string",
          percentase: "int/float",
        },
      ],
    };

    const docRef = await addDoc(
      collection(db, "diagnosed_history"),
      predictData
    );

    res.status(200).json({
      status: "success",
      message: "Predict image successfully",
      data: {
        id: docRef.id,
        user_id: userId,
        image: imageUrl,
        email: req.user.email,
        created_at: predictData.created_at,
        updated_at: predictData.updated_at,
        main_prediction_result: {
          disease: "string",
          accuracy: "int/float",
          description: "string",
        },
        other_prediction_result: [
          {
            disease: "string",
            percentase: "int/float",
          },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to predict",
      error: error.message,
    });
  }
};

const getPredictHistory = async (req, res) => {
  try {
    const q = query(
      collection(db, "diagnosed_history"),
      where("user_id", "==", req.user.id)
    );
    const querySnapshot = await getDocs(q);

    const predictHistory = [];
    querySnapshot.forEach((doc) => {
      predictHistory.push(doc.data());
    });

    res.status(200).json({
      status: "success",
      message: "Predict history retrieved successfully",
      data: predictHistory,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to get predict history",
      error: error.message,
    });
  }
};

module.exports = {
  predict,
  getPredictHistory,
  upload,
};
