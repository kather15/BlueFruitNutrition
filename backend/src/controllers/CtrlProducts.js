const productsController = {};
import productsModel from "../models/Products.js"
import "../models/NutritionalValues.js"; // Importa el modelo para que se registre

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
    const products = await productsModel.find().populate("idNutritionalValues")
    res.json(products)
}

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
    }
}


//DELETE*************************************************
productsController.deleteProducts = async (req, res) => {
   await productsModel.findByIdAndDelete(req.params.id)

    res.json({ message: "Product deleted" })
}


//UPDATE*************************************************
productsController.putProducts = async (req, res) => {
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

    res.json({ message: "Products updated successfully" })
};

export default productsController;