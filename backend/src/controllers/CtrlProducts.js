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

// GET all products
productsController.getProducts = async (req, res) => {
  try {
    console.log("📥 Solicitud GET productos");
    const products = await productsModel.find().populate("idNutritionalValues");
    console.log(`✅ ${products.length} productos encontrados`);
    res.status(200).json(products);
  } catch (error) {
    console.error("🔴 Error en getProducts:", error.message);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// GET product by ID
productsController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 Solicitud GET producto ID: ${id}`);

    const product = await productsModel.findById(id).populate("idNutritionalValues");

    if (!product) {
      console.log("⚠️ Producto no encontrado");
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    console.log("✅ Producto encontrado:", product.name);
    res.status(200).json(product);
  } catch (error) {
    console.error("🔴 Error en getProductById:", error.message);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// POST new product with Cloudinary upload
productsController.postProducts = async (req, res) => {
  try {
    console.log("📥 Datos recibidos en postProducts:", req.body);

    if (!req.file) {
      console.log("⚠️ No se recibió archivo en req.file");
      return res.status(400).json({ message: "Imagen es requerida" });
    }

    console.log("📁 Archivo recibido en req.file:", req.file.path);

    // Subida sin allowed_formats para evitar error firma
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    console.log("☁️ Upload a Cloudinary exitoso:", result.secure_url);

    fs.unlinkSync(req.file.path);
    console.log("🗑️ Archivo local eliminado:", req.file.path);

    const { name, description, flavor, price, idNutritionalValues } = req.body;

    const newProduct = new productsModel({
      name,
      description,
      flavor,
      price,
      image: result.secure_url,
      idNutritionalValues,
    });

    const savedProduct = await newProduct.save();

    console.log("🟢 Producto guardado en DB, ID:", savedProduct._id);
    res.status(201).json({ message: "Producto guardado", id: savedProduct._id });
  } catch (error) {
    console.error("🔴 Error en postProducts:", error.message);
    res.status(500).json({ message: "Error al guardar el producto", error: error.message });
  }
};

// DELETE product by ID
productsController.deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 Solicitud DELETE producto ID: ${id}`);

    const deletedProduct = await productsModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      console.log("⚠️ Producto a eliminar no encontrado");
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    console.log("🟢 Producto eliminado:", id);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("🔴 Error en deleteProducts:", error.message);
    res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
  }
};

// PUT update product by ID (optional image)
productsController.putProducts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 Solicitud PUT producto ID: ${id}`);
    console.log("Datos recibidos en putProducts:", req.body);

    const { name, description, flavor, price, idNutritionalValues } = req.body;

    let updatedData = {
      name,
      description,
      flavor,
      price,
      idNutritionalValues,
    };

    if (req.file) {
      console.log("📁 Archivo recibido en req.file para update:", req.file.path);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      updatedData.image = result.secure_url;
      fs.unlinkSync(req.file.path);
      console.log("🗑️ Archivo local eliminado tras update:", req.file.path);
    }

    const updatedProduct = await productsModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      console.log("⚠️ Producto a actualizar no encontrado");
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    console.log("🟢 Producto actualizado:", updatedProduct._id);
    res.status(200).json({ message: "Producto actualizado correctamente", updatedProduct });
  } catch (error) {
    console.error("🔴 Error en putProducts:", error.message);
    res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
  }
};

productsController.getRandom = async (req, res) => {
  try {
    const count = await productsModel.countDocuments();
    if (count === 0) return res.status(404).json({ message: "No hay productos disponibles" });

    const randomIndex = Math.floor(Math.random() * count);
    const randomProduct = await productsModel.findOne().skip(randomIndex);

    res.json(randomProduct);
  } catch (error) {
    console.error("Error obteniendo producto aleatorio:", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export default productsController;

