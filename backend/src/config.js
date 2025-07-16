import dotenv from "dotenv";

dotenv.config();

//INFO DEL .ENV
export const config={
    db: {
        URI: process.env.MONGO_URI
    },

    server: {
        port: process.env.PORT
    },

    JWT: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES
    },

    emailAdmin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    },
    
    email: {
        email_user: process.env.EMAIL_USER,
        email_pass: process.env.EMAIL_PASS
    },

    cloudinary: {
        cloudinary_name: process.env.CLOUDINARY_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET 
    }
}