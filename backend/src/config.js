import dotenv from "dotenv";

dotenv.config();

//INFO DEL .ENV
export const config={

    db: {
        URI: process.env.MONGO_URI //Base de datos en Mongo
    },

    server: {
        port: process.env.PORT //Puerto 
    },

    JWT: {
        secret: process.env.JWT_SECRET,         //JWT para el inicio de sesión
        expiresIn: process.env.JWT_EXPIRES
    },

    emailAdmin: {
        email: process.env.ADMIN_EMAIL,         //Correo y contraseña del administrador
        password: process.env.ADMIN_PASSWORD
    },
    
    email: {
        email_user: process.env.EMAIL_USER,     //Correo y contraseña de desarrollador para mandar emails de recuperación de contraseña o verificación
        email_pass: process.env.EMAIL_PASS
    },

    cloudinary: {
        cloudinary_name: process.env.CLOUDINARY_NAME,           //Subir imagenes a cloudinary
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET 
    }
}