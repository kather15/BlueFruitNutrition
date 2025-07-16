import ShoppingCartModel from "../models/ShoppingCart.js"; 

const ShoppingCartController = {};

// Obtener todos los carritos
ShoppingCartController.getShoppingCart = async (req, res) => {
  try {
    const carritos = await ShoppingCartModel.find();
    res.json(carritos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carritos", error });
  }
};

// Insertar carrito nuevo
ShoppingCartController.insertShoppingCart = async (req, res) => {
  try {
    const { id_product,total,quantityProducts } = req.body;
    const nuevoCarrito = new ShoppingCartModel({
      id_product,
      total,
      quantityProducts,

    });
    await nuevoCarrito.save();
    res.status(201).json({ message: "Carrito guardado", carrito: nuevoCarrito });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar carrito", error });
  }
};

// Eliminar carrito
ShoppingCartController.deleteShoppingCart = async (req, res) => {
  try {
    await ShoppingCartModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Carrito eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar carrito", error });
  }
};

// Actualizar carrito
ShoppingCartController.updateShoppingCart = async (req, res) => {
  try {
    const { id_product,total,quantityProducts} = req.body;
    const carritoActualizado = await ShoppingCartModel.findByIdAndUpdate(
      req.params.id,
      { id_product,total,quantityProducts },
      { new: true }
    );
    res.json({ message: "Carrito actualizado", carrito: carritoActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar carrito", error });
  }
};

export default ShoppingCartController;
