# 🫐 PTC-BlueFruitNutrition

## 👥 Integrantes

- **Katherine Sofia Ceron Guillen** - *20220026* - Coordinadora  
- **Rodrigo Leonel Torres Escobar** - *20200594* - Subcoordinador
- **David Miguel Zepeda Romero** - *20230231* - Secretario
- **Olga Fernanda Mendez Flores** - *20220525* - Tesorero 
- **Rodrigo Jose Cordova Monge** - *20230333* - Vocal  

---

## 💡 Proyecto

**Blue Fruit Nutrición** es una compañía nacional dedicada a la investigación, formulación y desarrollo de productos funcionales dirigidos a deportistas de alto rendimiento y personas activas. Somos actualmente los únicos fabricantes de geles energéticos en el país, y competimos en la región centroamericana con presencia en Costa Rica, Panamá y Guatemala, frente a productos mayoritariamente importados.  

---

## 🛠️ Tecnologías

Este proyecto fue desarrollado usando el stack **MERN**:

- **MongoDB** – Base de datos NoSQL para usuarios, productos, pedidos, historial, etc.  
- **Express.js** – Framework backend sobre Node.js  
- **React.js** – Interfaz web para clientes, proveedores y administradores  
- **Node.js** – Entorno de ejecución del backend  
- **JavaScript** – Lenguaje principal en backend y frontend  

---

## ⚙️ Configuraciones y funcionalidades del sistema

### 🌐 Sistema Web

#### Módulo de Cliente
- Navegación de productos  
- Compras en línea  
- Visualización de novedades  

#### Módulo de Proveedor
- Inicio de sesión especial  
- Compra de productos al por mayor  

#### Módulo de Administrador
- Gestión de inventario  
- Gestión de pedidos  

### 📱 Aplicación Móvil

Incluye todas las funciones del sistema web, más:

- Personalización de experiencia de usuario  
- Registro de datos físicos (peso, altura)  
- Recomendaciones personalizadas según:
  - Tipo de deporte  
  - Momento de consumo del producto (antes, durante o después del ejercicio)

---

## 📦 Módulos, dependencias y ejecución

### 📁 Frontend

Hay dos carpetas: `frontend/` y `frontend-public/`. Ambas son aplicaciones React con Vite.

#### 🔗 Dependencias principales

- `react`
- `react-dom`
- `react-router-dom`
- `react-hook-form` *(solo en `frontend-public`)*

#### ⚙️ Dependencias de desarrollo

- `vite`
- `@vitejs/plugin-react`
- `eslint`
- `@eslint/js`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `@types/react`
- `@types/react-dom`
- `globals`

#### 📜 Scripts disponibles


npm run dev       # Ejecuta en modo desarrollo

####🔧 Backend
Ubicación: backend/

#### 📦 Dependencias
express

mongoose

cors, cookie-parser, dotenv

jsonwebtoken, bcrypt, bcryptjs

nodemailer

cloudinary, multer, multer-storage-cloudinary

 #### 📜 Script principal
node index.js

####  🛠 Instalación
cd backend
npm install

#### ✨ Frontend (frontend/ y frontend-public/)
Se utiliza camelCase para:

Rutas: para frontend/ y frontend-public

#### ⚙️ Backend (backend/)
Se utiliza camelCase para:

Rutas (por ejemplo, passwordRecovery)

Se utiliza PascalCase para:

Nombres de modelos (ej. Customers.js, ShoppingCart.js)

Nombres de controladores (ej. CtrlProducts.js)




