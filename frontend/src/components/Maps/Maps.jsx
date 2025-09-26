import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

const apiURL = "http://localhost:4000/locations";

const containerStyle = {
  width: "100%",
  height: "500px"
};

const center = {
  lat: 13.7028, // San Salvador, El Salvador
  lng: -89.2073
};

const GoogleMapAdmin = () => {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    openingHours: '9:00 AM - 6:00 PM',
    lat: '',
    lng: ''
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "TU_API_KEY_AQUI" // 🔑 Sustituye esto
  });

  const fetchLocations = async () => {
    try {
      const res = await fetch(apiURL);
      const data = await res.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setClickedPosition({ lat, lng });
    setFormData({
      name: '',
      address: '',
      openingHours: '9:00 AM - 6:00 PM',
      lat: lat,
      lng: lng
    });
    setEditingLocation(null);
    setShowForm(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingLocation ? 'PUT' : 'POST';
      const url = editingLocation ? `${apiURL}/${editingLocation._id}` : apiURL;
      
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchLocations();
        setShowForm(false);
        setEditingLocation(null);
        setClickedPosition(null);
        setFormData({
          name: '',
          address: '',
          openingHours: '9:00 AM - 6:00 PM',
          lat: '',
          lng: ''
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error al guardar la ubicación');
    }
  };

  const handleEdit = (location) => {
    setFormData({
      name: location.name,
      address: location.address,
      openingHours: location.openingHours,
      lat: location.lat,
      lng: location.lng
    });
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      try {
        await fetch(`${apiURL}/${id}`, { method: "DELETE" });
        await fetchLocations();
        setSelected(null);
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingLocation(null);
    setClickedPosition(null);
    setFormData({
      name: '',
      address: '',
      openingHours: '9:00 AM - 6:00 PM',
      lat: '',
      lng: ''
    });
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel Administrativo - Sucursales</h1>
      <p>Haz clic en el mapa para agregar una nueva sucursal</p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Mapa */}
        <div style={{ flex: '1', minWidth: '500px' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={handleMapClick}
          >
            {/* Marcadores de ubicaciones existentes */}
            {locations.map((location) => (
              <Marker
                key={location._id}
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => setSelected(location)}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }}
              />
            ))}

            {/* Marcador temporal para nueva ubicación */}
            {clickedPosition && (
              <Marker
                position={clickedPosition}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            )}

            {/* InfoWindow para ubicaciones existentes */}
            {selected && (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => setSelected(null)}
              >
                <div style={{ maxWidth: '250px' }}>
                  <h3>{selected.name}</h3>
                  <p><strong>Dirección:</strong> {selected.address}</p>
                  <p><strong>Horario:</strong> {selected.openingHours}</p>
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      onClick={() => handleEdit(selected)}
                      style={{ 
                        marginRight: '5px', 
                        padding: '5px 10px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(selected._id)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Formulario */}
        {showForm && (
          <div style={{ 
            flex: '0 0 300px', 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3>{editingLocation ? 'Editar Sucursal' : 'Nueva Sucursal'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nombre de la Sucursal:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ej: Sucursal Centro"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Dirección:
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ej: Av. Principal #123, San Salvador"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Horario de Apertura:
                </label>
                <input
                  type="text"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ej: 8:00 AM - 8:00 PM"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Coordenadas:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    step="any"
                    required
                    style={{ 
                      flex: 1, 
                      padding: '8px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px' 
                    }}
                    placeholder="Latitud"
                  />
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    step="any"
                    required
                    style={{ 
                      flex: 1, 
                      padding: '8px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px' 
                    }}
                    placeholder="Longitud"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{ 
                    flex: 1,
                    padding: '10px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {editingLocation ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  style={{ 
                    flex: 1,
                    padding: '10px', 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Lista de ubicaciones */}
      <div style={{ marginTop: '30px' }}>
        <h2>Sucursales Registradas ({locations.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {locations.map((location) => (
            <div 
              key={location._id}
              style={{ 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{location.name}</h4>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>📍</strong> {location.address}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>🕒</strong> {location.openingHours}
              </p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#6c757d' }}>
                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
              </p>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => handleEdit(location)}
                  style={{ 
                    marginRight: '5px', 
                    padding: '5px 10px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(location._id)}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapAdmin;