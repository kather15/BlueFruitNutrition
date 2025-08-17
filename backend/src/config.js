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
        email_pass: process.env.EMAIL_PASS,
        to: process.env.EMAIL_USER //Para el fromulario de contactos, manda los datos llenados en el formulario a el propio gmail
    },

    emailverification:{
        emailV_user: process.env.EMAIL_V,  //Es con el correo noreply el gmail para verificar el codigo del login
        emailV_pass: process.env.PASS_V
    },

    cloudinary: {
        cloudinary_name: process.env.CLOUDINARY_NAME,           //Subir imagenes a cloudinary
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET 
    },

    wompi: {
        client_id:process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: process.env.GRANT_TYPE,
        audience: process.env.AUDIENCE
    }
};