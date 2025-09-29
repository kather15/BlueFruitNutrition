import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ProductsList.css';

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlavors, setSelectedFlavors] = useState({}); // Para manejar sabor seleccionado por producto

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/products', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }

      const data = await response.json();
      
      // Procesar productos y sus sabores
      const processedProducts = data.map(product => {
        let flavorsArray = [];
        
        if (product.flavor) {
          if (typeof product.flavor === 'string') {
            try {
              flavorsArray = JSON.parse(product.flavor);
              if (!Array.isArray(flavorsArray)) {
                flavorsArray = [product.flavor];
              }
            } catch (error) {
              flavorsArray = [product.flavor];
            }
          } else if (Array.isArray(product.flavor)) {
            flavorsArray = product.flavor;
          } else {
            flavorsArray = [String(product.flavor)];
          }
        }

        // Limpiar sabores vacíos
        flavorsArray = flavorsArray.filter(f => f && f.trim().length > 0);

        return { ...product, flavor: flavorsArray };
      });

      setProducts(processedProducts);

      // Inicializar sabores seleccionados (primer sabor de cada producto)
      const initialFlavors = {};
      processedProducts.forEach(product => {
        if (product.flavor && product.flavor.length > 0) {
          initialFlavors[product._id] = product.flavor[0];
        }
      });
      setSelectedFlavors(initialFlavors);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleFlavorChange = (productId, flavor) => {
    setSelectedFlavors(prev => ({
      ...prev,
      [productId]: flavor
    }));
  };

  const handleAddToCart = (product) => {
    const selectedFlavor = selectedFlavors[product._id];
    
    if (product.flavor && product.flavor.length > 0 && !selectedFlavor) {
      toast.error("Por favor selecciona un sabor");
      return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productId = product._id;

    // Crear ID único con sabor
    const uniqueId = selectedFlavor ? `${productId}_${selectedFlavor}` : productId;

    const existente = carrito.find(p => p.id === uniqueId);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        id: uniqueId,
        productId: productId,
        nombre: product.name,
        precio: product.price,
        cantidad: 1,
        sabor: selectedFlavor || 'Sin sabor',
        imagen: product.image || '/placeholder-product.png'
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    const flavorText = selectedFlavor ? ` - ${selectedFlavor}` : '';
    toast.success(`Agregado: ${product.name}${flavorText}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="products-list-container">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-list-container">
      <div className="products-header">
        <h1>Nuestros Productos</h1>
        <p>Descubre nuestra gama de productos nutricionales</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image-container" onClick={() => handleProductClick(product._id)}>
              <img
                src={product.image || '/placeholder-product.png'}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
            </div>

            <div className="product-info">
              <h3 className="product-name" onClick={() => handleProductClick(product._id)}>
                {product.name}
              </h3>
              
              <p className="product-description">
                {product.description && product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description
                }
              </p>

              <div className="product-price">${product.price.toFixed(2)}</div>

              {/* Selector de sabores en cada tarjeta */}
              {product.flavor && product.flavor.length > 0 && (
                <div className="product-flavor-selector">
                  <label className="flavor-label-small">Sabor:</label>
                  <select
                    value={selectedFlavors[product._id] || ''}
                    onChange={(e) => handleFlavorChange(product._id, e.target.value)}
                    className="flavor-select-small"
                  >
                    {product.flavor.map((flavor, index) => (
                      <option key={index} value={flavor}>
                        {flavor}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="product-actions">
                <button
                  className="add-to-cart-btn-small"
                  onClick={() => handleAddToCart(product)}
                >
                  Agregar al Carrito
                </button>
                <button
                  className="view-details-btn"
                  onClick={() => handleProductClick(product._id)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          <h3>No hay productos disponibles</h3>
          <p>Vuelve más tarde para ver nuestros productos</p>
        </div>
      )}
    </div>
  );
};

export default ProductsList;