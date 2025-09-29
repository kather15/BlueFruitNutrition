// src/controllers/CtrlProducts.js
import productsModel from "../models/Products.js";
import "../models/NutritionalValues.js";
import { config } from "../config.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const productsController = {};

// POST - crear producto
productsController.postProducts = async (req, res) => {
  try {
    console.log("📥 Datos recibidos en postProducts:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Imagen es requerida" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
    fs.unlinkSync(req.file.path);

    let { name, description, flavor, price, idNutritionalValues } = req.body;

    // Procesar flavor como array
    let processedFlavor;
    if (typeof flavor === "string") {
      try {
        const parsed = JSON.parse(flavor);
        processedFlavor = Array.isArray(parsed) ? parsed : [flavor];
      } catch {
        processedFlavor = [flavor];
      }
    } else if (Array.isArray(flavor)) {
      processedFlavor = flavor;
    } else {
      processedFlavor = [String(flavor)];
    }
    processedFlavor = processedFlavor.map(f => String(f).trim()).filter(f => f.length > 0);

    const newProduct = new productsModel({
      name,
      description,
      flavor: processedFlavor,
      price,
      image: result.secure_url,
      idNutritionalValues,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Producto guardado", id: savedProduct._id, product: savedProduct });
  } catch (error) {
    console.error("Error en postProducts:", error.message);
    res.status(500).json({ message: "Error al guardar el producto", error: error.message });
  }
};

// GET - obtener todos los productos
productsController.getProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error en getProducts:", error.message);
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

// GET - obtener producto por ID
productsController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsModel.findById(id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error en getProductById:", error.message);
    res.status(500).json({ message: "Error al obtener el producto", error: error.message });
  }
};

// PUT - actualizar producto
productsController.putProducts = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
      fs.unlinkSync(req.file.path);
      updateData.image = result.secure_url;
    }

    if (updateData.flavor) {
      let flavor = updateData.flavor;
      let processedFlavor;

      if (typeof flavor === "string") {
        try {
          const parsed = JSON.parse(flavor);
          processedFlavor = Array.isArray(parsed) ? parsed : [flavor];
        } catch {
          processedFlavor = [flavor];
        }
      } else if (Array.isArray(flavor)) {
        processedFlavor = flavor;
      } else {
        processedFlavor = [String(flavor)];
      }

      processedFlavor = processedFlavor.map(f => String(f).trim()).filter(f => f.length > 0);
      updateData.flavor = processedFlavor;
    }

    const updatedProduct = await productsModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado para actualizar" });

    res.status(200).json({ message: "Producto actualizado", product: updatedProduct });
  } catch (error) {
    console.error("Error en putProducts:", error.message);
    res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
  }
};

// DELETE - eliminar producto
productsController.deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productsModel.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado para eliminar" });

    res.status(200).json({ message: "Producto eliminado", product: deletedProduct });
  } catch (error) {
    console.error("Error en deleteProducts:", error.message);
    res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
  }
};

// GET - producto aleatorio
productsController.getRandom = async (req, res) => {
  try {
    const count = await productsModel.countDocuments();
    if (count === 0) return res.status(404).json({ message: "No hay productos disponibles" });

    const randomIndex = Math.floor(Math.random() * count);
    const randomProduct = await productsModel.findOne().skip(randomIndex);

    res.json(randomProduct);
  } catch (error) {
    console.error("Error obteniendo producto aleatorio:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default productsController;
