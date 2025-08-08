import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './ProductsMenu.css'; 

const ProductsC = () => {
  const navigate = useNavigate(); 
  // Crea una función para cambiar de página (ruta)

  const [products, setProducts] = useState([]); 
  // Declara un estado local llamado 'products' inicializado como arreglo vacío,
  // 'setProducts' es la función para actualizar ese estado

  useEffect(() => {
    // useEffect se ejecuta cuando el componente se monta (porque el segundo argumento es un arreglo vacío [])

    fetch('http://localhost:4000/api/products') 

      .then(response => response.json()) 
      // Convierte la respuesta en formato JSON

      .then(data => setProducts(data)) 
      // Actualiza el estado 'products' con los datos recibidos del backend

      .catch(error => console.error('Error fetching products:', error)); 
      // En caso de error, lo muestra en la consola
  }, []);

    const handleProductClick = (productId) => {
    //Navegación para otra pantalla
    navigate(`/producto/${productId}`); 
    };


  return (
    <div className="products-screen-wrapper">
      <div className="products-screen">
        <div className="products-main-content">
          <div className="products-container">
            <h1 className="products-title">Nuestros Productos</h1>

            <div className="products-grid">
              {products.map((product) => (
                // Recorre el arreglo 'products' y para cada producto renderiza un div

                <div key={product._id} className="product-card-item">
                  <div className="product-image-wrapper">
                   
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <button
                    className="product-view-btn"
                    onClick={() => handleProductClick(product._id)} 
                    
                  >
                    Ver Producto
                  </button>
                </div>
              ))}
              {products.length === 0 && <p>No hay productos disponibles.</p>}
              {/* Si el arreglo 'products' está vacío, muestra un mensaje */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsC;

