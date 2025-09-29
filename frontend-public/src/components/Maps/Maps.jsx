import React, { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import { FiMapPin, FiClock, FiPhone, FiRefreshCw} from "react-icons/fi";
import toast from 'react-hot-toast';
import './Maps.css';

// Definir libraries fuera del componente
const libraries = ['places'];

const StoresMap = () => {
  const [selectedStore, setSelectedStore] = useState(0);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapSelectedStore, setMapSelectedStore] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 13.7028, lng: -89.2073 }); // San Salvador

  // URL del API - debe coincidir con GoogleMapAdmin
  const apiURL = "http://localhost:4000/api/location";

  // Configuración de Google Maps
  const googleMapsApiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey,
    libraries
  });

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "12px"
  };

  // Función para obtener las ubicaciones del backend
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(apiURL, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transformar los datos del backend al formato que espera el componente
      const transformedStores = data.map((location, index) => ({
        id: index + 1,
        name: location.name,
        address: location.address,
        coordinates: { lat: location.lat, lng: location.lng },
        phone: location.phone || "Contactar tienda",
        hours: location.openingHours,
        _id: location._id
      }));
      
      setStores(transformedStores);
      
      // Si hay tiendas pero no hay una seleccionada, seleccionar la primera
      if (transformedStores.length > 0 && selectedStore >= transformedStores.length) {
        setSelectedStore(0);
      }

      // Centrar el mapa en la primera tienda si hay tiendas disponibles
      if (transformedStores.length > 0) {
        setMapCenter(transformedStores[0].coordinates);
      }
      
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError(error.message);
      toast.error(`Error al cargar las tiendas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las tiendas al montar el componente
  useEffect(() => {
    fetchStores();
  }, []);

  // Actualizar centro del mapa cuando se selecciona una tienda
  useEffect(() => {
    if (stores.length > 0 && stores[selectedStore]) {
      setMapCenter(stores[selectedStore].coordinates);
    }
  }, [selectedStore, stores]);

  const openInGoogleMaps = (store) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const getDirections = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  // Manejar clic en marcador
  const handleMarkerClick = useCallback((store) => {
    setMapSelectedStore(store);
    // También actualizar la tienda seleccionada en la lista
    const storeIndex = stores.findIndex(s => s._id === store._id);
    if (storeIndex !== -1) {
      setSelectedStore(storeIndex);
    }
  }, [stores]);

  // Manejar clic en tienda de la lista
  const handleStoreSelect = (index) => {
    setSelectedStore(index);
    setMapSelectedStore(stores[index]);
    setMapCenter(stores[index].coordinates);
  };

  // Componente de carga para Maps
  if (loadError) {
    return (
      <section className="stores-map-section">
        <div className="stores-map-container">
          <h2>Encuentra una tienda</h2>
          <div className="error-container">
            <p> Error al cargar Google Maps</p>
            <p>Verifica la configuración del API Key</p>
          </div>
        </div>
      </section>
    );
  }

  // Componente de carga
  if (loading || !isLoaded) {
    return (
      <section className="stores-map-section">
        <div className="stores-map-container">
          <h2>Encuentra una tienda</h2>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando {loading ? 'tiendas' : 'mapa'}...</p>
          </div>
        </div>
      </section>
    );
  }

  // Componente de error
  if (error) {
    return (
      <section className="stores-map-section">
        <div className="stores-map-container">
          <h2>Encuentra una tienda</h2>
          <div className="error-container">
            <p> Error al cargar las tiendas</p>
            <button onClick={fetchStores} className="retry-btn">
              Intentar nuevamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay tiendas
  if (stores.length === 0) {
    return (
      <section className="stores-map-section">
        <div className="stores-map-container">
          <h2>Encuentra una tienda</h2>
          <div className="empty-state">
            <p> No hay tiendas disponibles en este momento</p>
            <button onClick={fetchStores} className="retry-btn">
              Actualizar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stores-map-section">
      <div className="stores-map-container">
        <div className="stores-header">
          <h2>Encuentra una tienda</h2>
          <div className="stores-count">
            {stores.length} {stores.length === 1 ? 'tienda disponible' : 'tiendas disponibles'}
          </div>
          <button 
  onClick={fetchStores} 
  className="refresh-btn" 
  title="Actualizar tiendas"
>
  <FiRefreshCw />
</button>

        </div>
        
        <div className="stores-map-content">
          {/* Lista de tiendas */}
          <div className="stores-list">
            {stores.map((store, index) => (
              <div
                key={store._id || store.id}
                className={`store-item ${selectedStore === index ? 'active' : ''}`}
                onClick={() => handleStoreSelect(index)}
              >
                <div className="store-number">{store.id}</div>
                <div className="store-details">
                  <h3>{store.name}</h3>
                <p className="store-address"><span className="icon"><FiMapPin /></span> {store.address}</p>
<p className="store-contact"><span className="icon"><FiPhone /></span> {store.phone}</p>
<p className="store-hours"><span className="icon"><FiClock /></span> {store.hours}</p>

                  <div className="store-buttons">
                    <button 
                      className="directions-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInGoogleMaps(store);
                      }}
                      title="Ver ubicación en el mapa"
                    >
                      Ver en mapa
                    </button>
                    <button 
                      className="directions-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(store);
                      }}
                      title="Obtener direcciones"
                    >
                      Cómo llegar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mapa interactivo de Google Maps */}
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              options={{
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
                zoomControl: true,
                styles: [
                  {
                    featureType: "poi.business",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              }}
            >
              {/* Marcadores para todas las tiendas */}
              {stores.map((store) => (
                <Marker
                  key={store._id}
                  position={store.coordinates}
                  onClick={() => handleMarkerClick(store)}
                  title={store.name}
                  icon={{
                    url: selectedStore === stores.findIndex(s => s._id === store._id) 
                      ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                      : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(32, 32)
                  }}
                  animation={mapSelectedStore && mapSelectedStore._id === store._id ? 
                    window.google.maps.Animation.BOUNCE : null}
                />
              ))}

              {/* InfoWindow para tienda seleccionada en el mapa */}
              {mapSelectedStore && (
                <InfoWindow
                  position={mapSelectedStore.coordinates}
                  onCloseClick={() => setMapSelectedStore(null)}
                >
                  <div className="map-info-window">
                    <h3 className="info-title">{mapSelectedStore.name}</h3>
                    <div className="info-details">
  <p><span className="icon"><FiMapPin /></span> {mapSelectedStore.address}</p>
  <p><span className="icon"><FiClock /></span> {mapSelectedStore.hours}</p>
  <p><span className="icon"><FiPhone /></span> {mapSelectedStore.phone}</p>
</div>

                    <div className="info-actions">
                      <button 
                        onClick={() => getDirections(mapSelectedStore)}
                        className="btn btn-primary"
                      >
                         Cómo llegar
                      </button>
                      <button 
                        onClick={() => openInGoogleMaps(mapSelectedStore)}
                        className="btn btn-secondary"
                      >
                         Ver en Google Maps
                      </button>
                      {mapSelectedStore.phone && mapSelectedStore.phone !== "Contactar tienda" && (
                        <a 
                          href={`tel:${mapSelectedStore.phone}`}
                          className="btn btn-phone"
                        >
                           Llamar
                        </a>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoresMap;