import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook para navegación entre rutas
import "./CheckoutPage.css";

// Objeto que contiene todos los departamentos y sus municipios
const departamentosMunicipios = {
  Ahuachapán: ["Ahuachapán", "Apaneca", "Atiquizaya", "Concepción de Ataco", "El Refugio", "Guaymango", "Jujutla", "San Francisco Menéndez", "San Lorenzo", "San Pedro Puxtla", "Tacuba", "Turín"],
  Cabañas: ["Cinquera", "Dolores", "Guacotecti", "Ilobasco", "Jutiapa", "San Isidro", "Sensuntepeque", "Tejutepeque", "Victoria"],
  Chalatenango: ["Agua Caliente", "Arcatao", "Azacualpa", "Citalá", "Comalapa", "Concepción Quezaltepeque", "Dulce Nombre de María", "El Carrizal", "El Paraíso", "La Laguna", "La Palma", "La Reina", "Las Vueltas", "Nombre de Jesús", "Nueva Concepción", "Nueva Trinidad", "Ojos de Agua", "Potonico", "San Antonio de la Cruz", "San Antonio Los Ranchos", "San Fernando", "San Francisco Lempa", "San Francisco Morazán", "San Ignacio", "San Isidro Labrador", "San Luis del Carmen", "San Miguel de Mercedes", "San Rafael", "Santa Rita", "Tejutla"],
  Cuscatlán: ["Candelaria", "Cojutepeque", "El Carmen", "El Rosario", "Monte San Juan", "Oratorio de Concepción", "San Bartolomé Perulapía", "San Cristóbal", "San José Guayabal", "San Pedro Perulapán", "San Rafael Cedros", "San Ramón", "Santa Cruz Analquito", "Santa Cruz Michapa", "Suchitoto", "Tenancingo"],
  LaLibertad: ["Antiguo Cuscatlán", "Chiltiupán", "Ciudad Arce", "Colón", "Comasagua", "Huizúcar", "Jayaque", "Jicalapa", "La Libertad", "Nuevo Cuscatlán", "Quezaltepeque", "Sacacoyo", "San José Villanueva", "San Juan Opico", "San Matías", "San Pablo Tacachico", "Santa Tecla", "Talnique", "Tamanique", "Teotepeque", "Zaragoza"],
  LaPaz: ["Cuyultitán", "El Rosario", "Jerusalén", "Mercedes La Ceiba", "Olocuilta", "Paraíso de Osorio", "San Antonio Masahuat", "San Emigdio", "San Francisco Chinameca", "San Juan Nonualco", "San Juan Talpa", "San Juan Tepezontes", "San Luis La Herradura", "San Luis Talpa", "San Miguel Tepezontes", "San Pedro Masahuat", "San Pedro Nonualco", "San Rafael Obrajuelo", "Santa María Ostuma", "Santiago Nonualco", "Tapalhuaca", "Zacatecoluca"],
  LaUnión: ["Anamorós", "Bolívar", "Concepción de Oriente", "Conchagua", "El Carmen", "El Sauce", "Intipucá", "La Unión", "Lislique", "Meanguera del Golfo", "Nueva Esparta", "Pasaquina", "Polorós", "San Alejo", "San José", "Santa Rosa de Lima", "Yayantique", "Yucuaiquín"],
  Morazán: ["Arambala", "Cacaopera", "Chilanga", "Corinto", "Delicias de Concepción", "El Divisadero", "El Rosario", "Gualococti", "Guatajiagua", "Joateca", "Jocoaitique", "Jocoro", "Lolotiquillo", "Meanguera", "Osicala", "Perquín", "San Carlos", "San Fernando", "San Francisco Gotera", "San Isidro", "San Simón", "Sensembra", "Sociedad", "Torola", "Yamabal", "Yoloaiquín"],
  SanMiguel: ["Carolina", "Chapeltique", "Chinameca", "Chirilagua", "Ciudad Barrios", "Comacarán", "El Tránsito", "Lolotique", "Moncagua", "Nueva Guadalupe", "Nuevo Edén de San Juan", "Quelepa", "San Antonio", "San Gerardo", "San Jorge", "San Luis de la Reina", "San Miguel", "San Rafael Oriente", "Sesori", "Uluazapa"],
  SanSalvador: ["Aguilares", "Apopa", "Ayutuxtepeque", "Cuscatancingo", "Delgado", "El Paisnal", "Guazapa", "Ilopango", "Mejicanos", "Nejapa", "Panchimalco", "Rosario de Mora", "San Marcos", "San Martín", "San Salvador", "Santiago Texacuangos", "Santo Tomás", "Soyapango", "Tonacatepeque"],
  SanVicente: ["Apastepeque", "Guadalupe", "San Cayetano Istepeque", "San Esteban Catarina", "San Ildefonso", "San Lorenzo", "San Sebastián", "San Vicente", "Santa Clara", "Santo Domingo", "Tecoluca", "Tepetitán", "Verapaz"],
  SantaAna: ["Santa Ana", "Candelaria de la Frontera", "Chalchuapa", "Coatepeque", "El Congo", "El Porvenir", "Masahuat", "Metapán", "San Antonio Pajonal", "San Sebastián Salitrillo", "Santa Rosa Guachipilín", "Santiago de la Frontera", "Texistepeque"],
  Sonsonate: ["Acajutla", "Armenia", "Caluco", "Cuisnahuat", "Izalco", "Juayúa", "Nahuizalco", "Nahulingo", "Salcoatitán", "San Antonio del Monte", "San Julián", "Santa Catarina Masahuat", "Santa Isabel Ishuatán", "Santo Domingo de Guzmán", "Sonsonate", "Sonzacate"],
  Usulután: ["Alegría", "Berlín", "California", "Concepción Batres", "El Triunfo", "Ereguayquín", "Estanzuelas", "Jiquilisco", "Jucuapa", "Jucuarán", "Mercedes Umaña", "Nueva Granada", "Ozatlán", "Puerto El Triunfo", "San Agustín", "San Buenaventura", "San Dionisio", "San Francisco Javier", "Santa Elena", "Santa María", "Santiago de María", "Tecapán", "Usulután"]
};

const AddressForm = () => {
  // Estados para almacenar la selección del usuario
  const [selectedDept, setSelectedDept] = useState(""); // Departamento seleccionado
  const [selectedMunicipio, setSelectedMunicipio] = useState(""); // Municipio seleccionado
  const [direccion, setDireccion] = useState(""); // Dirección exacta
  const [referencia, setReferencia] = useState(""); // Punto de referencia

  const navigate = useNavigate(); // Hook para navegar entre rutas
  const municipios = selectedDept ? departamentosMunicipios[selectedDept] || [] : []; // Municipios disponibles del departamento seleccionado

  // Navega hacia /carrito
  const handleBack = () => navigate("/carrito");

  // Navega hacia /pay solo si los campos obligatorios están completos
  const handlePay = () => {
    if (selectedDept && selectedMunicipio && direccion.trim()) {
      navigate("/pay");
    }
  };

  return (
    <div className="container">
      <h2 className="title">Dirección de Envío</h2>

      <div className="form-card">
        {/* Selección de departamento y municipio */}
        <div className="flex-row">
          <div className="form-group flex-1">
            <label>Departamento:</label>
            <select
              className="input"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setSelectedMunicipio(""); // Reinicia el municipio al cambiar departamento
              }}
            >
              <option value="">Seleccione un departamento</option>
              {Object.keys(departamentosMunicipios).map((dept) => (
                <option key={dept} value={dept}>
                  {dept.replace(/([A-Z])/g, " $1").trim()} {/* Agrega espacio entre palabras */}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label>Municipio:</label>
            <select
              className="input"
              value={selectedMunicipio}
              onChange={(e) => setSelectedMunicipio(e.target.value)}
              disabled={!selectedDept} // Deshabilitado si no hay departamento seleccionado
            >
              <option value="">Seleccione un municipio</option>
              {municipios.map((muni) => (
                <option key={muni} value={muni}>
                  {muni}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo para dirección completa */}
        <div className="form-group">
          <label>Dirección Completa*</label>
          <input
            type="text"
            placeholder="Ej: Calle los naranjos, casa #10"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="input"
          />
        </div>

        {/* Campo para puntos de referencia */}
        <div className="form-group">
          <label>Puntos de referencia</label>
          <input
            type="text"
            placeholder="Ej: Frente a la tienda El Rosario"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            className="input"
          />
        </div>

        {/* Botones de navegación */}
        <div className="button-row">
          <button onClick={handleBack} className="btn-outline">
            Regresar
          </button>
          <button
            onClick={handlePay}
            disabled={!selectedDept || !selectedMunicipio || !direccion.trim()} // Solo habilitado si todo está lleno
            className={`btn-primary ${
              !selectedDept || !selectedMunicipio || !direccion.trim() ? "disabled" : ""
            }`}
          >
            Ir a pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressForm; 
