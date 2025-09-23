# 🫐 PTC-BlueFruitNutrition

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 👥 Integrantes del Equipo
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 👥 Integrantes del Equipo

- **Katherine Sofia Ceron Guillen** - *20220026* - Coordinadora  
- **Rodrigo Leonel Torres Escobar** - *20200594* - Subcoordinador
- **David Miguel Zepeda Romero** - *20230231* - Secretario
- **Olga Fernanda Mendez Flores** - *20220525* - Tesorero 
- **Rodrigo Jose Cordova Monge** - *20230333* - Vocal  

---

## 💡 Descripción del Proyecto
## 💡 Descripción del Proyecto

**Blue Fruit Nutrición** es una compañía nacional dedicada a la investigación, formulación y desarrollo de productos funcionales dirigidos a deportistas de alto rendimiento y personas activas. Somos actualmente los únicos fabricantes de geles energéticos en el país, y competimos en la región centroamericana con presencia en Costa Rica, Panamá y Guatemala, frente a productos mayoritariamente importados.

### 🎯 Objetivos del Sistema
- Desarrollar una plataforma integral de comercio electrónico para productos nutricionales especializados
- Facilitar la gestión de inventarios y pedidos para diferentes tipos de usuarios
- Proporcionar una experiencia personalizada tanto en web como en móvil
- Optimizar las ventas al por mayor para proveedores y distribuidores

## ✨ Características Principales

### 🌐 Sistema Web Completo

#### 👤 Módulo de Cliente
- **Navegación de productos** con catálogo completo
- **Compras en línea** con carrito persistente
- **Visualización de novedades** y productos destacados
- **Sistema de reseñas** y calificaciones de productos
- **Gestión de perfil** personal

#### 🏢 Módulo de Proveedor/Distribuidor
- **Inicio de sesión especializado** con autenticación diferenciada
- **Compra de productos al por mayor** con precios especiales
- **Gestión de pedidos** y historial de compras
- **Panel de control** personalizado

#### 🔐 Módulo de Administrador
- **Gestión completa de inventario** con CRUD de productos
- **Administración de pedidos** y seguimiento de estados
- **Dashboard con métricas** en tiempo real
- **Gestión de usuarios** (clientes y proveedores)
- **Sistema de reportes** y análisis de ventas

## 🛠️ Tecnologías Utilizadas

Este proyecto fue desarrollado usando el stack **MERN**:

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Entorno de ejecución del servidor |
| **Express.js** | 5.1.0 | Framework backend sobre Node.js |
| **MongoDB** | 8.17.1 | Base de datos NoSQL para usuarios, productos, pedidos |
| **Mongoose** | 8.17.1 | ODM para MongoDB |
| **JavaScript** | ES6+ | Lenguaje principal en backend y frontend |

#### 📦 Dependencias Principales del Backend
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.17.1",
  "cors": "^2.8.5",
  "cookie-parser": "^1.4.7",
  "dotenv": "^16.6.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "nodemailer": "^7.0.5",
  "cloudinary": "^1.41.3",
  "multer": "^2.0.2",
  "multer-storage-cloudinary": "^4.0.0",
  "pdfkit": "^0.17.1",
  "swagger-ui-express": "^5.0.1"
}
```

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React.js** | 18+ | Interfaz web para clientes, proveedores y administradores |
| **Vite** | Latest | Build tool y servidor de desarrollo |
| **React Router Dom** | Latest | Navegación entre páginas |
| **React Hook Form** | Latest | Manejo de formularios (solo en frontend-public) |

#### 📦 Dependencias Principales del Frontend
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "react-hook-form": "^7.0.0"
}
```

#### ⚙️ Dependencias de Desarrollo
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "eslint": "^8.0.0",
  "@eslint/js": "^9.0.0",
  "eslint-plugin-react-hooks": "^4.0.0",
  "eslint-plugin-react-refresh": "^0.4.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "globals": "^15.0.0"
}
```

## 🗂️ Estructura del Proyecto

```
PTC-BlueFruitNutrition/
├── backend/                      # Servidor Express.js
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── CtrlProducts.js   # Gestión de productos
│   │   │   ├── CtrlCustomers.js  # Gestión de clientes
│   │   │   ├── CtrlDistributors.js # Gestión distribuidores/proveedores
│   │   │   ├── CtrlLogin.js      # Autenticación unificada
│   │   │   ├── CtrlOrdenes.js    # Gestión de órdenes
│   │   │   ├── CtrlPayment3ds.js # Pagos con Wompi
│   │   │   ├── CtrlReview.js     # Sistema de reseñas
│   │   │   ├── CtrlBill.js       # Generación de facturas PDF
│   │   │   ├── CtrlContact.js    # Formulario de contacto
│   │   │   ├── CtrlShoppingCart.js # Carrito de compras
│   │   │   ├── CtrlSubscriptions.js # Gestión de suscripciones
│   │   │   ├── CtrlSession.js    # Verificación de sesiones
│   │   │   └── CtrlPasswordRecovery.js # Recuperación de contraseñas
│   │   ├── models/               # Modelos de MongoDB
│   │   │   ├── Products.js       # Esquema de productos
│   │   │   ├── Customers.js      # Esquema de clientes
│   │   │   ├── Distributors.js   # Esquema distribuidores/proveedores
│   │   │   ├── Ordenes.js        # Esquema de órdenes
│   │   │   ├── Review.js         # Esquema de reseñas
│   │   │   ├── ShoppingCart.js   # Esquema del carrito
│   │   │   ├── Subscriptions.js  # Esquema suscripciones
│   │   │   ├── NutritionalValues.js # Valores nutricionales
│   │   │   └── Question.js       # Preguntas del chatbot
│   │   ├── routes/               # Rutas de la API
│   │   │   ├── products.js       # Rutas de productos
│   │   │   ├── customers.js      # Rutas de clientes
│   │   │   ├── distributors.js   # Rutas de proveedores
│   │   │   ├── login.js          # Rutas de autenticación
│   │   │   ├── logout.js         # Rutas de cierre de sesión
│   │   │   ├── ordenes.js        # Rutas de órdenes
│   │   │   ├── pay.js            # Rutas de pagos
│   │   │   ├── reviews.js        # Rutas de reseñas
│   │   │   ├── registerCustomer.js # Registro de clientes
│   │   │   ├── registerDistributor.js # Registro de proveedores
│   │   │   ├── passwordRecovery.js # Recuperación de contraseñas
│   │   │   ├── shoppingCart.js   # Rutas del carrito
│   │   │   ├── subscriptions.js  # Rutas de suscripciones
│   │   │   ├── contact.js        # Rutas de contacto
│   │   │   ├── bill.js           # Rutas de facturación
│   │   │   ├── token.js          # Rutas de tokens de pago
│   │   │   ├── testPayment.js    # Rutas de pagos de prueba
│   │   │   ├── adminVerify.js    # Verificación de administrador
│   │   │   ├── session.js        # Verificación de sesiones
│   │   │   └── chatRoutes.js     # Rutas del chatbot
│   │   ├── middlewares/          # Middlewares personalizados
│   │   ├── utils/                # Utilidades y helpers
│   │   └── config.js             # Configuración general
│   ├── assets/                   # Recursos estáticos (logos, etc.)
│   ├── uploads/                  # Archivos temporales
│   ├── app.js                    # Configuración de Express
│   ├── database.js               # Conexión a MongoDB
│   ├── index.js                  # Punto de entrada del servidor
│   ├── package.json              # Dependencias del backend
│   └── bluefruit-bluefruit_api-1.0.0-swagger.json # Documentación API
├── frontend/                     # Aplicación React principal
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── admin/            # Componentes administrativos
│   │   │   ├── auth/             # Componentes de autenticación
│   │   │   ├── products/         # Componentes de productos
│   │   │   ├── cart/             # Componentes del carrito
│   │   │   └── ui/               # Componentes reutilizables
│   │   ├── pages/                # Páginas de la aplicación
│   │   ├── hooks/                # Custom hooks de React
│   │   ├── context/              # Context API para estado global
│   │   ├── assets/               # Recursos estáticos
│   │   ├── App.jsx               # Componente principal
│   │   ├── App.css               # Estilos principales
│   │   ├── index.css             # Estilos globales
│   │   └── main.jsx              # Punto de entrada
│   ├── public/                   # Archivos públicos
│   ├── package.json              # Dependencias del frontend
│   ├── package-lock.json         # Lock file de dependencias
│   ├── vite.config.js            # Configuración de Vite
│   ├── eslint.config.js          # Configuración de ESLint
│   └── README.md                 # README específico del frontend
├── frontend-public/              # Aplicación React pública
│   ├── src/                      # Estructura similar a frontend/
│   ├── public/                   # Archivos públicos específicos
│   ├── package.json              # Dependencias específicas
│   ├── vite.config.js            # Configuración de Vite
│   └── yarn.lock                 # Lock file de Yarn
└── README.md                     # Este archivo
```

## 🎨 Convenciones de Nomenclatura

### 📁 Archivos y Carpetas

#### ✨ Frontend (`frontend/` y `frontend-public/`)
- **camelCase**: Para rutas y nombres de componentes internos
- **PascalCase**: Para componentes React principales
- **kebab-case**: Para nombres de archivos CSS y assets

#### ⚙️ Backend (`backend/`)
- **camelCase**: Para rutas (ejemplo: `passwordRecovery`, `registerCustomer`)
- **PascalCase**: Para nombres de modelos (ej. `Customers.js`, `ShoppingCart.js`)
- **PascalCase**: Para nombres de controladores (ej. `CtrlProducts.js`, `CtrlLogin.js`)

### 💻 Variables y Funciones
```javascript
// Variables - camelCase
const userName = 'Katherine';
const isAuthenticated = true;
const productData = {};

// Funciones - camelCase
const handleSubmit = () => {};
const validateForm = () => {};
const fetchProductData = () => {};

// Componentes React - PascalCase
const ProductCard = () => {};
const AuthModal = () => {};
const AdminDashboard = () => {};

// Constantes - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:4000';
const MAX_FILE_SIZE = 5242880;
```

### 🗄️ Base de Datos (MongoDB)
- **Colecciones**: PascalCase (Products, Customers, Orders, Distributors)
- **Campos**: camelCase (name, email, createdAt, isVerified)
- **Índices**: snake_case (idx_email, idx_created_at)

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos
- **Node.js** v18 o superior
- **MongoDB** v6 o superior
- **npm** o **yarn**
- **Git**

### ⚙️ Configuración del Backend

1. **Clonar el repositorio**:
```bash
git clone https://github.com/tu-usuario/ptc-bluefruit-nutrition.git
cd ptc-bluefruit-nutrition/backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
Crear archivo `.env` en la carpeta `backend/`:
```env
# Base de datos
DB_URI=mongodb://localhost:27017/bluefruit_db

# Servidor
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=24h

# Email (Gmail)
USER_EMAIL=tu_email@gmail.com
USER_PASS=tu_password_de_aplicacion

# Email para verificaciones
EMAILV_USER=verificacion@bluefruit.com
EMAILV_PASS=password_verificacion

# Cloudinary
CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Wompi (Pagos)
WOMPI_ACCESS_TOKEN=tu_token_de_wompi
GRANT_TYPE=client_credentials
CLIENT_ID=tu_client_id
CLIENT_SECRET=tu_client_secret
AUDIENCE=https://api.wompi.sv

# Admin
ADMIN_EMAIL=admin@bluefruit.com
ADMIN_PASSWORD=admin_secure_password

```

4. **Ejecutar el servidor**:
```bash
# Script principal
### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Entorno de ejecución del servidor |
| **Express.js** | 5.1.0 | Framework backend sobre Node.js |
| **MongoDB** | 8.17.1 | Base de datos NoSQL para usuarios, productos, pedidos |
| **Mongoose** | 8.17.1 | ODM para MongoDB |
| **JavaScript** | ES6+ | Lenguaje principal en backend y frontend |

#### 📦 Dependencias Principales del Backend
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.17.1",
  "cors": "^2.8.5",
  "cookie-parser": "^1.4.7",
  "dotenv": "^16.6.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "nodemailer": "^7.0.5",
  "cloudinary": "^1.41.3",
  "multer": "^2.0.2",
  "multer-storage-cloudinary": "^4.0.0",
  "pdfkit": "^0.17.1",
  "swagger-ui-express": "^5.0.1"
}
```

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React.js** | 18+ | Interfaz web para clientes, proveedores y administradores |
| **Vite** | Latest | Build tool y servidor de desarrollo |
| **React Router Dom** | Latest | Navegación entre páginas |
| **React Hook Form** | Latest | Manejo de formularios (solo en frontend-public) |

#### 📦 Dependencias Principales del Frontend
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "react-hook-form": "^7.0.0"
}
```

#### ⚙️ Dependencias de Desarrollo
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "eslint": "^8.0.0",
  "@eslint/js": "^9.0.0",
  "eslint-plugin-react-hooks": "^4.0.0",
  "eslint-plugin-react-refresh": "^0.4.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "globals": "^15.0.0"
}
```

## 🗂️ Estructura del Proyecto

```
PTC-BlueFruitNutrition/
├── backend/                      # Servidor Express.js
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── CtrlProducts.js   # Gestión de productos
│   │   │   ├── CtrlCustomers.js  # Gestión de clientes
│   │   │   ├── CtrlDistributors.js # Gestión distribuidores/proveedores
│   │   │   ├── CtrlLogin.js      # Autenticación unificada
│   │   │   ├── CtrlOrdenes.js    # Gestión de órdenes
│   │   │   ├── CtrlPayment3ds.js # Pagos con Wompi
│   │   │   ├── CtrlReview.js     # Sistema de reseñas
│   │   │   ├── CtrlBill.js       # Generación de facturas PDF
│   │   │   ├── CtrlContact.js    # Formulario de contacto
│   │   │   ├── CtrlShoppingCart.js # Carrito de compras
│   │   │   ├── CtrlSubscriptions.js # Gestión de suscripciones
│   │   │   ├── CtrlSession.js    # Verificación de sesiones
│   │   │   └── CtrlPasswordRecovery.js # Recuperación de contraseñas
│   │   ├── models/               # Modelos de MongoDB
│   │   │   ├── Products.js       # Esquema de productos
│   │   │   ├── Customers.js      # Esquema de clientes
│   │   │   ├── Distributors.js   # Esquema distribuidores/proveedores
│   │   │   ├── Ordenes.js        # Esquema de órdenes
│   │   │   ├── Review.js         # Esquema de reseñas
│   │   │   ├── ShoppingCart.js   # Esquema del carrito
│   │   │   ├── Subscriptions.js  # Esquema suscripciones
│   │   │   ├── NutritionalValues.js # Valores nutricionales
│   │   │   └── Question.js       # Preguntas del chatbot
│   │   ├── routes/               # Rutas de la API
│   │   │   ├── products.js       # Rutas de productos
│   │   │   ├── customers.js      # Rutas de clientes
│   │   │   ├── distributors.js   # Rutas de proveedores
│   │   │   ├── login.js          # Rutas de autenticación
│   │   │   ├── logout.js         # Rutas de cierre de sesión
│   │   │   ├── ordenes.js        # Rutas de órdenes
│   │   │   ├── pay.js            # Rutas de pagos
│   │   │   ├── reviews.js        # Rutas de reseñas
│   │   │   ├── registerCustomer.js # Registro de clientes
│   │   │   ├── registerDistributor.js # Registro de proveedores
│   │   │   ├── passwordRecovery.js # Recuperación de contraseñas
│   │   │   ├── shoppingCart.js   # Rutas del carrito
│   │   │   ├── subscriptions.js  # Rutas de suscripciones
│   │   │   ├── contact.js        # Rutas de contacto
│   │   │   ├── bill.js           # Rutas de facturación
│   │   │   ├── token.js          # Rutas de tokens de pago
│   │   │   ├── testPayment.js    # Rutas de pagos de prueba
│   │   │   ├── adminVerify.js    # Verificación de administrador
│   │   │   ├── session.js        # Verificación de sesiones
│   │   │   └── chatRoutes.js     # Rutas del chatbot
│   │   ├── middlewares/          # Middlewares personalizados
│   │   ├── utils/                # Utilidades y helpers
│   │   └── config.js             # Configuración general
│   ├── assets/                   # Recursos estáticos (logos, etc.)
│   ├── uploads/                  # Archivos temporales
│   ├── app.js                    # Configuración de Express
│   ├── database.js               # Conexión a MongoDB
│   ├── index.js                  # Punto de entrada del servidor
│   ├── package.json              # Dependencias del backend
│   └── bluefruit-bluefruit_api-1.0.0-swagger.json # Documentación API
├── frontend/                     # Aplicación React principal
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── admin/            # Componentes administrativos
│   │   │   ├── auth/             # Componentes de autenticación
│   │   │   ├── products/         # Componentes de productos
│   │   │   ├── cart/             # Componentes del carrito
│   │   │   └── ui/               # Componentes reutilizables
│   │   ├── pages/                # Páginas de la aplicación
│   │   ├── hooks/                # Custom hooks de React
│   │   ├── context/              # Context API para estado global
│   │   ├── assets/               # Recursos estáticos
│   │   ├── App.jsx               # Componente principal
│   │   ├── App.css               # Estilos principales
│   │   ├── index.css             # Estilos globales
│   │   └── main.jsx              # Punto de entrada
│   ├── public/                   # Archivos públicos
│   ├── package.json              # Dependencias del frontend
│   ├── package-lock.json         # Lock file de dependencias
│   ├── vite.config.js            # Configuración de Vite
│   ├── eslint.config.js          # Configuración de ESLint
│   └── README.md                 # README específico del frontend
├── frontend-public/              # Aplicación React pública
│   ├── src/                      # Estructura similar a frontend/
│   ├── public/                   # Archivos públicos específicos
│   ├── package.json              # Dependencias específicas
│   ├── vite.config.js            # Configuración de Vite
│   └── yarn.lock                 # Lock file de Yarn
└── README.md                     # Este archivo
```

## 🎨 Convenciones de Nomenclatura

### 📁 Archivos y Carpetas

#### ✨ Frontend (`frontend/` y `frontend-public/`)
- **camelCase**: Para rutas y nombres de componentes internos
- **PascalCase**: Para componentes React principales
- **kebab-case**: Para nombres de archivos CSS y assets

#### ⚙️ Backend (`backend/`)
- **camelCase**: Para rutas (ejemplo: `passwordRecovery`, `registerCustomer`)
- **PascalCase**: Para nombres de modelos (ej. `Customers.js`, `ShoppingCart.js`)
- **PascalCase**: Para nombres de controladores (ej. `CtrlProducts.js`, `CtrlLogin.js`)

### 💻 Variables y Funciones
```javascript
// Variables - camelCase
const userName = 'Katherine';
const isAuthenticated = true;
const productData = {};

// Funciones - camelCase
const handleSubmit = () => {};
const validateForm = () => {};
const fetchProductData = () => {};

// Componentes React - PascalCase
const ProductCard = () => {};
const AuthModal = () => {};
const AdminDashboard = () => {};

// Constantes - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:4000';
const MAX_FILE_SIZE = 5242880;
```

### 🗄️ Base de Datos (MongoDB)
- **Colecciones**: PascalCase (Products, Customers, Orders, Distributors)
- **Campos**: camelCase (name, email, createdAt, isVerified)
- **Índices**: snake_case (idx_email, idx_created_at)

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos
- **Node.js** v18 o superior
- **MongoDB** v6 o superior
- **npm** o **yarn**
- **Git**

### ⚙️ Configuración del Backend

1. **Clonar el repositorio**:
```bash
git clone https://github.com/tu-usuario/ptc-bluefruit-nutrition.git
cd ptc-bluefruit-nutrition/backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
Crear archivo `.env` en la carpeta `backend/`:
```env
# Base de datos
DB_URI=mongodb://localhost:27017/bluefruit_db

# Servidor
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=24h

# Email (Gmail)
USER_EMAIL=tu_email@gmail.com
USER_PASS=tu_password_de_aplicacion

# Email para verificaciones
EMAILV_USER=verificacion@bluefruit.com
EMAILV_PASS=password_verificacion

# Cloudinary
CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Wompi (Pagos)
WOMPI_ACCESS_TOKEN=tu_token_de_wompi
GRANT_TYPE=client_credentials
CLIENT_ID=tu_client_id
CLIENT_SECRET=tu_client_secret
AUDIENCE=https://api.wompi.sv

# Admin
ADMIN_EMAIL=admin@bluefruit.com
ADMIN_PASSWORD=admin_secure_password

```

4. **Ejecutar el servidor**:
```bash
# Script principal
node index.js

# O en desarrollo (si tienes nodemon configurado)
npm run dev
```

### 🎨 Configuración del Frontend

#### Frontend Principal (`frontend/`)

1. **Navegar al directorio**:
```bash
cd ../frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar la aplicación**:
```bash
# Ejecuta en modo desarrollo
npm run dev
```

#### Frontend Público (`frontend-public/`)

1. **Navegar al directorio**:
```bash
cd ../frontend-public
```

2. **Instalar dependencias**:
```bash
# O en desarrollo (si tienes nodemon configurado)
npm run dev
```

### 🎨 Configuración del Frontend

#### Frontend Principal (`frontend/`)

1. **Navegar al directorio**:
```bash
cd ../frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar la aplicación**:
```bash
# Ejecuta en modo desarrollo
npm run dev
```

#### Frontend Público (`frontend-public/`)

1. **Navegar al directorio**:
```bash
cd ../frontend-public
```

2. **Instalar dependencias**:
```bash
npm install
# o si prefieres yarn
yarn install
```

3. **Ejecutar la aplicación**:
```bash
# Ejecuta en modo desarrollo
npm run dev
```

## 🔧 Scripts Disponibles

### Backend
```bash
node index.js          # Ejecutar servidor principal
npm install            # Instalar dependencias
```

### Frontend (Ambas carpetas)
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Construir para producción (si está configurado)
npm run preview        # Vista previa de build (si está configurado)
npm install            # Instalar dependencias
```

## 🔒 Seguridad Implementada

### 🛡️ Medidas de Seguridad del Backend
- **Encriptación de contraseñas** con bcryptjs
- **Tokens JWT** para autenticación segura
- **Validación de entrada** en todos los endpoints
- **CORS configurado** para dominios específicos
- **Autenticación diferenciada** por tipo de usuario (cliente, proveedor, admin)

### 🔐 Sistema de Autenticación
- **Registro con verificación** por email
- **Recuperación segura** de contraseñas con tokens temporales
- **Sesiones persistentes** con verificación automática
- **Roles diferenciados** con permisos específicos
- **Doble verificación** para administradores

## 🚀 Funcionalidades Implementadas

### ✅ Características Principales
- [x] **Sistema de autenticación** completo con roles diferenciados
- [x] **CRUD completo** para productos, usuarios y órdenes
- [x] **Carrito de compras** persistente y funcional
- [x] **Sistema de pagos** integrado con Wompi
- [x] **Generación de facturas** en PDF automática
- [x] **Sistema de reseñas** y calificaciones de productos
- [x] **Panel administrativo** con gestión completa
- [x] **Subida de imágenes** con Cloudinary
- [x] **Sistema de emails** automatizado
- [x] **Chatbot integrado** para atención al cliente
- [x] **API REST completa** con documentación Swagger

### ✅ Validaciones y Seguridad
- **Frontend**: Validaciones con React Hook Form
- **Backend**: Validaciones de seguridad y formato de datos
- **Base de datos**: Validaciones a nivel de esquema con Mongoose

