const { db } = require("../config/db");
const { collection, getDocs, doc, getDoc, query, orderBy, limit, addDoc, Timestamp } = require("firebase/firestore");
const Disease = require("../models/disease.model");

const getDiseases = async (req, res) => {
    try {
        const diseasesSnapshot = await getDocs(collection(db, "diseases"));
        const diseases = [];
        diseasesSnapshot.forEach((doc) => {
            const data = doc.data();
            diseases.push({
                id: doc.id,
                ...data,
                created_at: data.created_at.toMillis(),
                updated_at: data.updated_at.toMillis()
            });
        });
        res.status(200).json(diseases);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to get diseases",
            error: error.message,
        });
    }
};

const getDiseaseById = async (req, res) => {
    try {
        const diseaseId = req.params.id;
        const diseaseDoc = await getDoc(doc(db, "diseases", diseaseId));
        if (!diseaseDoc.exists()) {
            return res.status(404).json({
                status: "failed",
                message: "Disease not found",
            });
        }
        const data = diseaseDoc.data();
        res.status(200).json({
            ...data,
            created_at: data.created_at.toMillis(),
            updated_at: data.updated_at.toMillis()
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to get disease",
            error: error.message,
        });
    }
};


const addDisease = async (req, res) => {
    try {
        const { name, description, image, content, treatment_recommendation, medicine_recommendation } = req.body;

        if (!name || !description || !image || !content || !treatment_recommendation || !medicine_recommendation) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all required fields",
                data: null
            });
        }

        const created_at = Timestamp.now();
        const updated_at = Timestamp.now();

        const newDisease = new Disease( name, description, image, content, treatment_recommendation, medicine_recommendation, created_at, updated_at);

        const docRef = await addDoc(collection(db, "diseases"), newDisease.toJSON());

        res.status(201).json({
            status: "success",
            message: "Disease added successfully",
            data: { id: docRef.id, ...newDisease.toJSON() }
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to add disease",
            error: error.message,
        });
    }
};

module.exports = {
    getDiseases,
    getDiseaseById,
    addDisease,
};