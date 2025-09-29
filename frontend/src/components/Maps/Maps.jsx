import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import {
  FiMapPin,
  FiClock,
  FiMap,
  FiCalendar,
  FiCompass
} from "react-icons/fi";
import toast from "react-hot-toast";
import './Maps.css';

// Libraries para Google Maps
const libraries = ['places'];

// URL del API
const apiURL = "http://localhost:4000/api/location";

// Estilo del contenedor
const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "12px"
};

// Centro por defecto
const center = { lat: 13.7028, lng: -89.2073 };

const GoogleMapAdmin = () => {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    openingHours: '9:00 AM - 6:00 PM',
    lat: '',
    lng: ''
  });

  const mapRef = useRef();

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({   
    googleMapsApiKey,  
    libraries
  });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      console.log('Intentando cargar desde:', apiURL);
      
      const res = await fetch(apiURL, { credentials: 'include' });
      
      console.log(' Response status:', res.status);
      console.log(' Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      setLocations(data);
      console.log('Ubicaciones cargadas:', data.length);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error(`Error al cargar ubicaciones: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleMapClick = useCallback((e) => {
    const lat = parseFloat(e.latLng.lat().toFixed(6));
    const lng = parseFloat(e.latLng.lng().toFixed(6));

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

    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setFormData(prev => ({ ...prev, address: results[0].formatted_address }));
        }
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { toast.error('El nombre de la sucursal es obligatorio'); return false; }
    if (!formData.address.trim()) { toast.error('La dirección es obligatoria'); return false; }
    if (!formData.lat || !formData.lng) { toast.error('Las coordenadas son obligatorias'); return false; }
    if (formData.lat < -90 || formData.lat > 90) { toast.error('La latitud debe estar entre -90 y 90'); return false; }
    if (formData.lng < -180 || formData.lng > 180) { toast.error('La longitud debe estar entre -180 y 180'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const method = editingLocation ? 'PUT' : 'POST';
      const url = editingLocation ? `${apiURL}/${editingLocation._id}` : apiURL;

      const payload = { ...formData, lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) };
      console.log('Enviando:', method, 'a', url, payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success(editingLocation ? 'Sucursal actualizada correctamente' : 'Sucursal creada correctamente');
        await fetchLocations();
        cancelForm();
      } else {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        try { const errorData = JSON.parse(errorText); errorMessage = errorData.message || errorMessage; } catch {}
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally { setLoading(false); }
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
    setClickedPosition({ lat: location.lat, lng: location.lng });
    setShowForm(true);
    setSelected(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta sucursal?')) return;
    try {
      setLoading(true);
      const response = await fetch(`${apiURL}/${id}`, { method: "DELETE", credentials: 'include' });
      if (response.ok) { toast.success('Sucursal eliminada correctamente'); await fetchLocations(); setSelected(null); }
      else { const errorData = await response.json(); throw new Error(errorData.message || 'Error al eliminar'); }
    } catch (error) { toast.error(`Error al eliminar: ${error.message}`); }
    finally { setLoading(false); }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingLocation(null);
    setClickedPosition(null);
    setFormData({ name: '', address: '', openingHours: '9:00 AM - 6:00 PM', lat: '', lng: '' });
  };

  const handleMarkerClick = (location) => { setSelected(location); };

  if (loadError) return (<div className="error-container"><h2>Error al cargar Google Maps</h2><p>Verifica tu API Key</p></div>);
  if (!isLoaded) return (<div className="loading-container"><div className="spinner"></div><p>Cargando Google Maps...</p></div>);

  return (
    <div className="google-map-admin">
      <div className="admin-header">
        <h1>Gestión de Sucursales</h1>
        <p>Haz clic en el mapa para agregar o editar sucursales</p>
        <div className="stats">
          <span className="stat-item">Total: <strong>{locations.length}</strong> sucursales</span>
          {loading && <span className="loading-indicator">Cargando...</span>}
        </div>
      </div>
      
      <div className="admin-layout">
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={11}
            onClick={handleMapClick}
            ref={mapRef}
            options={{ streetViewControl: false, mapTypeControl: true, fullscreenControl: true, zoomControl: true, styles: [{ featureType: "poi.business", stylers: [{ visibility: "off" }] }] }}
          >
            {locations.map(loc => (
              <Marker
                key={loc._id}
                position={{ lat: loc.lat, lng: loc.lng }}
                onClick={() => handleMarkerClick(loc)}
                title={loc.name}
                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', scaledSize: new window.google.maps.Size(32, 32) }}
                animation={selected && selected._id === loc._id ? window.google.maps.Animation.BOUNCE : null}
              />
            ))}

            {clickedPosition && !editingLocation && (
              <Marker
                position={clickedPosition}
                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', scaledSize: new window.google.maps.Size(32, 32) }}
                title="Nueva sucursal"
                animation={window.google.maps.Animation.DROP}
              />
            )}

            {clickedPosition && editingLocation && (
              <Marker
                position={clickedPosition}
                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png', scaledSize: new window.google.maps.Size(32, 32) }}
                title="Editando ubicación"
                animation={window.google.maps.Animation.BOUNCE}
              />
            )}

            {selected && (
              <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
                <div className="info-window">
                  <h3 className="info-title">{selected.name}</h3>
                  <div className="info-details">
                    <p><FiMapPin /> {selected.address}</p>
                    <p><FiClock /> {selected.openingHours}</p>
                    <p><FiCompass /> {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}</p>
                  </div>
                  <div className="info-actions">
                    <button onClick={() => handleEdit(selected)} className="btn btn-edit" disabled={loading}>Editar</button>
                    <button onClick={() => handleDelete(selected._id)} className="btn btn-delete" disabled={loading}>Eliminar</button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {showForm && (
          <div className="form-container">
            <div className="form-header">
              <h3>{editingLocation ? 'Editar Sucursal' : '+ Nueva Sucursal'}</h3>
              <button onClick={cancelForm} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="location-form">
              <div className="form-group">
                <label>Nombre de la Sucursal:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required disabled={loading} placeholder="Ej: Sucursal Centro" />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} required disabled={loading} placeholder="Ej: Av. Principal #123, San Salvador" rows={3} />
              </div>
              <div className="form-group">
                <label>Horario de Atención:</label>
                <input type="text" name="openingHours" value={formData.openingHours} onChange={handleInputChange} required disabled={loading} placeholder="Ej: 8:00 AM - 8:00 PM" />
              </div>
              <div className="form-group">
                <label>Coordenadas:</label>
                <div className="coordinates-inputs">
                  <input type="number" name="lat" value={formData.lat} onChange={handleInputChange} step="any" required disabled={loading} placeholder="Latitud" />
                  <input type="number" name="lng" value={formData.lng} onChange={handleInputChange} step="any" required disabled={loading} placeholder="Longitud" />
                </div>
                <small>Haz clic en el mapa para obtener coordenadas automáticamente</small>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : editingLocation ? 'Actualizar' : '+ Crear Sucursal'}
                </button>
                <button type="button" onClick={cancelForm} className="btn btn-secondary" disabled={loading}>Cancelar</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="locations-grid">
        <h2>Sucursales Registradas ({locations.length})</h2>
        {locations.length === 0 && !loading ? (
          <div className="empty-state">
            <p>No hay sucursales registradas</p>
            <p>Haz clic en el mapa para agregar la primera sucursal</p>
          </div>
        ) : (
          <div className="grid">
            {locations.map(loc => (
              <div key={loc._id} className="location-card">
                <div className="card-header">
                  <h4>{loc.name}</h4>
                  <span className="status-badge active">Activa</span>
                </div>
                <div className="card-content">
                  <p><FiMapPin /> {loc.address}</p>
                  <p><FiClock /> {loc.openingHours}</p>
                  <p><FiMap /> {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}</p>
                  {loc.createdAt && <p><FiCalendar /> Creada: {new Date(loc.createdAt).toLocaleDateString()}</p>}
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(loc)} className="btn btn-edit" disabled={loading}>Editar</button>
                  <button onClick={() => handleDelete(loc._id)} className="btn btn-delete" disabled={loading}>Eliminar</button>
                  <button onClick={() => { setSelected(loc); mapRef.current?.panTo({ lat: loc.lat, lng: loc.lng }); }} className="btn btn-view">Ver en mapa</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapAdmin;
