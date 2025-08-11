const productsController = {};
import productsModel from "../models/Products.js"
import "../models/NutritionalValues.js"; // Importa el modelo para que se registre

//Dependencias de Cloudinary
import { config } from "../config.js"
import { v2 as cloudinary } from "cloudinary"


//Configuración de cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

//SELECT*************************************************
productsController.getProducts = async (req, res) => {
    try {
    const products = await productsModel.find().populate("idNutritionalValues")
    res.status(200).json(products) 
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
        
    }

}

  // Obtener un solo producto por su ID se necesita para la reseñas
productsController.getProductById = async (req, res) => {
    try {
        console.log("🔍 Obteniendo producto por ID:", req.params.id);
        const product = await productsModel.findById(req.params.id).populate("idNutritionalValues");
        
        if (!product) {
            console.log("❌ Producto no encontrado");
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        console.log("✅ Producto encontrado:", product.name);
        res.status(200).json(product);
    } catch (error) {
        console.log("❌ Error en getProductById:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//INSERT*************************************************
productsController.postProducts = async (req, res) => {

    try {
        const { name, description, flavor, price, idNutritionalValues } = req.body;
        let imageUrl = ""

        if (req.file) {
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "public",
                    allowed_formats: ["jpg", "png", "jpeg"]
                }
            )
            imageUrl = result.secure_url
        }
        const newProduct = new productsModel({ name, description, flavor, price, image: imageUrl, idNutritionalValues })
        await newProduct.save()

        res.json({ message: "Product saved" })
    }
         catch (error) {
        console.log("error: "+ error);
        res.status(500).json({ message: 'Internal Server Error' });

    }
}


//DELETE*************************************************
productsController.deleteProducts = async (req, res) => {
    try {
           await productsModel.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        console.log("error: "+ error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }

}


//UPDATE*************************************************
productsController.putProducts = async (req, res) => {
    try {
            const { name, description, flavor, price, idNutritionalValues } = req.body;
    let imageURL = "";

    //subir la imagen
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      imageURL = result.secure_url;
    }
    const updateProducts = await productsModel.findByIdAndUpdate(req.params.id, { name, description, flavor, price, image: imageURL, idNutritionalValues }, { new: true })
    res.status(200).json({ message: "Product updated"})
    res.json({ message: "Products updated successfully" })
    } catch (error) {
        console.log("error: "+ error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }

    
};

export default productsController;