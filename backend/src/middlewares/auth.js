import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config.js';


export const authenticateToken = (req, res, next) => {
  // Obtenemos el encabezado 'Authorization' de la solicitud HTTP
  const authHeader = req.headers['authorization'];

  // Extraemos el token 
  // Si no hay encabezado, token será undefined
  const token = authHeader && authHeader.split(' ')[1]; // Separa por espacio y toma la segunda parte (el token)

  // Si no se encuentra el token, respondemos con un error 401 (No autorizado)
  if (!token) {
    return res.status(401).json({ 
      message: 'Token de acceso requerido', // Mensaje personalizado
      requiresAuth: true // Indicamos que la autenticación es requerida
    });
  }

  // Verificamos el token con la clave secreta definida en la configuración
  jsonwebtoken.verify(token, config.JWT.secret, (err, user) => {
    // Si ocurre un error (token inválido o expirado), respondemos con un 403 (Prohibido)
    if (err) {
      return res.status(403).json({ 
        message: 'Token inválido o expirado',
        requiresAuth: true
      });
    }
    
    req.user = user;

    next();
  });
};


