import reviewModel from "../models/Review.js";

const reviewController = {};

// Obtener reseñas (todas o por producto específico)
reviewController.getReviews = async (req, res) => {
  try {
    const { idProduct } = req.query;

    let query = {};
    if (idProduct) {
      query.idProduct = idProduct;
    }

    const reviews = await reviewModel.find(query)
      .populate("idClient", "name email") // Traer nombre y email del cliente
      .populate("idProduct", "name")
      .sort({ createdAt: -1 }); // Más recientes primero

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reseñas",
      error: error.message
    });
  }
};

// Insertar una nueva reseña (requiere autenticación)
reviewController.insertReview = async (req, res) => {
  try {
    console.log('🚀 INICIO insertReview');
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    
    const { comment, rating, idProduct } = req.body;
    
    // El idClient viene del token de autenticación
    const idClient = req.user.id; // Extraído del JWT por el middleware
    
    console.log('📝 Datos para crear reseña:');
    console.log('- comment:', comment);
    console.log('- rating:', rating);
    console.log('- idProduct:', idProduct);
    console.log('- idClient:', idClient);

    // Validar campos requeridos
    if (!comment || !rating || !idProduct) {
      return res.status(400).json({
        message: "Faltan campos requeridos (comment, rating, idProduct)"
      });
    }

    // Validar que el rating esté en el rango correcto
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "La calificación debe estar entre 1 y 5"
      });
    }

    // Verificar si el usuario ya tiene una reseña para este producto
    const existingReview = await reviewModel.findOne({ 
      idClient, 
      idProduct 
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Ya has dejado una reseña para este producto"
      });
    }

    const newReview = new reviewModel({ 
      comment, 
      rating, 
      idClient, 
      idProduct 
    });
    
    await newReview.save();

    // Devolver la reseña con datos poblados
    const savedReview = await reviewModel.findById(newReview._id)
      .populate("idClient", "name email")
      .populate("idProduct", "name");

    res.status(201).json({ 
      message: "Reseña guardada correctamente",
      review: savedReview
    });
  } catch (error) {
    console.error('❌ Error en insertReview:', error);
    res.status(500).json({
      message: "Error al guardar reseña",
      error: error.message
    });
  }
};

// Eliminar reseña por ID (solo el autor o admin)
reviewController.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    
    const review = await reviewModel.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    // Verificar que el usuario sea el autor de la reseña o sea admin
    if (review.idClient.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "No tienes permisos para eliminar esta reseña" 
      });
    }

    await reviewModel.findByIdAndDelete(reviewId);
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar reseña", 
      error: error.message 
    });
  }
};

// Actualizar reseña por ID (solo el autor)
reviewController.updateReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await reviewModel.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    // Verificar que el usuario sea el autor
    if (review.idClient.toString() !== userId) {
      return res.status(403).json({ 
        message: "No tienes permisos para editar esta reseña" 
      });
    }

    const updatedReview = await reviewModel.findByIdAndUpdate(
      reviewId,
      { comment, rating },
      { new: true }
    ).populate("idClient", "name email");

    res.json({
      message: "Reseña actualizada correctamente",
      review: updatedReview
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar reseña", 
      error: error.message 
    });
  }
};

// Eliminar reseña por ID (sin autenticación)
reviewController.deleteReviewAdmin = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await reviewModel.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    await reviewModel.findByIdAndDelete(reviewId);
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar reseña", 
      error: error.message 
    });
  }
};

export default reviewController;