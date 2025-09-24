import recommendationModel from "../models/Recommendation.js"; 

const recommendationController = {};


recommendationController.getRecommendations = async (req, res) => {
  try {
    console.log("📥 Request to GET recommendations");
    const recommendations = await recommendationModel.find();
    console.log(`✅ ${recommendations.length} recommendations found`);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("🔴 Error in getRecommendations:", error.message);
    
    // error
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export default recommendationController;
