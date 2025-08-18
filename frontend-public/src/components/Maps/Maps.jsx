import React, { useState } from 'react';
import './Maps.css';

const StoresMap = () => {
  const [selectedStore, setSelectedStore] = useState(0);

  const stores = [
    {
      id: 1,
      name: "PROBIKES El Salvador",
      address: "Avenida La Capilla #212, San Salvador.",
      coordinates: { lat: 13.6929, lng: -89.2182 },
      phone: "+503 2222-3333",
      hours: "Lun-Vie: 8:00-18:00, Sáb: 8:00-17:00"
    },
    {
      id: 2,
      name: "Bike Center El Salvador",
      address: "79 Avenida Nte. 521, San Salvador.",
      coordinates: { lat: 13.7123, lng: -89.2075 },
      phone: "+503 2333-4444",
      hours: "Lun-Vie: 9:00-18:00, Sáb: 9:00-16:00"
    },
    {
      id: 3,
      name: "Flybikes Merliot",
      address: "Urb. Jardines de la Hacienda, calle El Pedregal, #7, Polig. A-6, Edif. Callari, 1a.Planta ( Locales 1 y 2. CD. Merliot. Ant. Cuscatlán, Depto. De, C. El Pedregal, Ciudad Merliot.",
      coordinates: { lat: 13.6789, lng: -89.2634 },
      phone: "+503 2444-5555",
      hours: "Lun-Vie: 8:30-18:30, Sáb: 8:30-17:00"
    },
    {
      id: 4,
      name: "Running World Center",
      address: "C. la Mascota y Av. Azaleas, col. Maquilishuat, Plaza Comercial Azaleas #10",
      coordinates: { lat: 13.7089, lng: -89.2456 },
      phone: "+503 2555-6666",
      hours: "Lun-Vie: 9:00-19:00, Sáb: 9:00-18:00"
    },
    {
      id: 5,
      name: "Carlitos Biker Sonsonate",
      address: "Frente a triángulo de la cruz, 10a Avenida Norte y, 4A Calle Oriente, Sonsonate 2301.",
      coordinates: { lat: 13.7167, lng: -89.7244 },
      phone: "+503 2666-7777",
      hours: "Lun-Vie: 8:00-17:00, Sáb: 8:00-16:00"
    },
    {
      id: 6,
      name: "Centro Profesional Buenos Aires. Nutrición Deportiva",
      address: "Calle Maquilishuat y Av. 4 de Mayo, Avenida 4 de Mayo, San Salvador.",
      coordinates: { lat: 13.7045, lng: -89.2167 },
      phone: "+503 2777-8888",
      hours: "Lun-Vie: 7:00-18:00, Sáb: 8:00-15:00"
    },
    {
      id: 7,
      name: "Cayaguanca Outdoor Equipment. Cascadas",
      address: "Centro Comercial Las Cascadas, Local 117, Antiguo Cuscatlán, La Libertad",
      coordinates: { lat: 13.6741, lng: -89.2540 },
      phone: "+503 6047 5056",
      hours: "Lun-Vie: 10:00-18:30, Sáb: 10:00-17:00, Dom: 11:00-15:00"
     },
    {
       id: 8,
      name: "Tienda Maca Colonia Escalón",
      address: "11 Calle Poniente, Colonia Escalón, San Salvador",
      coordinates: { lat: 13.6992, lng: -89.2226 },
      phone: "N/D",
      hours: "N/D"
     }


  ];

  // Coordenadas del centro de El Salvador para el mapa
  const centerCoordinates = { lat: 13.7942, lng: -88.8965 };

  const generateMapUrl = () => {
    const markersQuery = stores.map(store => 
      `markers=color:orange%7Clabel:${store.id}%7C${store.coordinates.lat},${store.coordinates.lng}`
    ).join('&');
    
    return `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${centerCoordinates.lat},${centerCoordinates.lng}&zoom=10&${markersQuery}`;
  };

  const openInGoogleMaps = (store) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <section className="stores-map-section">
      <div className="stores-map-container">
        <h2>Encuentra una tienda</h2>
        
        <div className="stores-map-content">
          {/* Lista de tiendas */}
          <div className="stores-list">
            {stores.map((store, index) => (
              <div
                key={store.id}
                className={`store-item ${selectedStore === index ? 'active' : ''}`}
                onClick={() => setSelectedStore(index)}
              >
                <div className="store-number">{store.id}</div>
                <div className="store-details">
                  <h3>{store.name}</h3>
                  <p className="store-address">{store.address}</p>
                  <p className="store-contact">{store.phone}</p>
                  <p className="store-hours">{store.hours}</p>
                  <button 
                    className="directions-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInGoogleMaps(store);
                    }}
                  >
                    Ver en mapa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mapa */}
          <div className="map-container">
            <div className="map-placeholder">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497698.77320394655!2d-89.46340827109378!3d13.794185718671588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f633176e6023ba3%3A0x2a7dd00dc8b8f855!2sEl%20Salvador!5e0!3m2!1ses!2ssv!4v1692895234567!5m2!1ses!2ssv"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de tiendas Blue Fruit"
              ></iframe>
              
              {/* Overlay con información de tienda seleccionada */}
              <div className="map-overlay">
                <div className="selected-store-info">
                  <h4>{stores[selectedStore].name}</h4>
                  <p>{stores[selectedStore].address}</p>
                  <div className="store-actions">
                    <button 
                      onClick={() => openInGoogleMaps(stores[selectedStore])}
                      className="map-action-btn"
                    >
                      Cómo llegar
                    </button>
                    <a 
                      href={`tel:${stores[selectedStore].phone}`}
                      className="map-action-btn phone-btn"
                    >
                      Llamar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoresMap;