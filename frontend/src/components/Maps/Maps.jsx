import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

const apiURL = "http://localhost:4000/locations"; // Tu backend

const containerStyle = {
  width: "100%",
  height: "500px"
};

const center = {
  lat: 0,
  lng: 0
};

const GoogleMapCRUD = () => {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "TU_API_KEY_AQUI" // 🔑 Sustituye esto
  });

  const fetchLocations = async () => {
    const res = await fetch(apiURL);
    const data = await res.json();
    setLocations(data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleMapClick = useCallback(async (e) => {
    const name = prompt("Nombre de la ubicación:");
    if (!name) return;

    const newLocation = {
      name,
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLocation)
    });

    fetchLocations();
  }, []);

  const deleteLocation = async (id) => {
    await fetch(`${apiURL}/${id}`, { method: "DELETE" });
    fetchLocations();
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div>
      <h2>CRUD con Google Maps</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        onClick={handleMapClick}
      >
        {locations.map((loc) => (
          <Marker
            key={loc._id}
            position={{ lat: loc.lat, lng: loc.lng }}
            onClick={() => setSelected(loc)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <strong>{selected.name}</strong><br />
              <button onClick={() => deleteLocation(selected._id)}>Eliminar</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapCRUD;
