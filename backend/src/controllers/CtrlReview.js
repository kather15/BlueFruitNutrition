import reviewModel from "../models/Review.js";

const reviewController = {};

// Obtener reseñas (todas o por producto específico)
reviewController.getReviews = async (req, res) => {
  try {
    const { idProduct } = req.query; // ← Parámetro opcional de filtro

    let query = {};
    if (idProduct) {
      query.idProduct = idProduct; // ← Filtrar si se proporciona
    }

    const reviews = await reviewModel.find(query)
      .populate("idClient", "name") // Traer solo el nombre del cliente
      .populate("idProduct", "name"); // Traer nombre del producto (opcional)

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reseñas",
      error: error.message
    });
  }
};

// Insertar una nueva reseña (ahora con idProduct)
reviewController.insertReview = async (req, res) => {
  try {
    const { comment, rating, idClient, idProduct } = req.body;

    // Validar campos requeridos
    if (!comment || !rating || !idClient || !idProduct) {
      return res.status(400).json({
        message: "Faltan campos requeridos (comment, rating, idClient, idProduct)"
      });
    }

    const newReview = new reviewModel({ comment, rating, idClient, idProduct });
    await newReview.save();

    res.status(201).json({ message: "Reseña guardada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al guardar reseña",
      error: error.message
    });
  }
};

// Eliminar reseña por ID
reviewController.deleteReview = async (req, res) => {
  try {
    await reviewModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar reseña", error: error.message });
  }
};

// Actualizar reseña por ID
reviewController.updateReview = async (req, res) => {
  try {
    const { comment, rating, idClient, idProduct } = req.body;

    const updatedReview = await reviewModel.findByIdAndUpdate(
      req.params.id,
      { comment, rating, idClient, idProduct },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    res.json({
      message: "Reseña actualizada correctamente",
      review: updatedReview
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar reseña", error: error.message });
  }
};

export default reviewController;
