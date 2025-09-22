import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://bluefruitnutrition1.onrender.com/api/profile", {
          method: "GET",
          credentials: "include", // importante para cookies
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al obtener datos");

        setUserData(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!userData) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-wrapper">
      <h1>Mi Perfil</h1>
      <div className="profile-card">
        <p><strong>Nombre:</strong> {userData.name || userData.companyName}</p>
        {userData.lastName && <p><strong>Apellido:</strong> {userData.lastName}</p>}
        <p><strong>Email:</strong> {userData.email}</p>
        {userData.phone && <p><strong>Teléfono:</strong> {userData.phone}</p>}
        {userData.address && <p><strong>Dirección:</strong> {userData.address}</p>}
        {userData.weight && <p><strong>Peso:</strong> {userData.weight} kg</p>}
        {userData.height && <p><strong>Altura:</strong> {userData.height} cm</p>}
        {userData.dateBirth && <p><strong>Fecha de nacimiento:</strong> {new Date(userData.dateBirth).toLocaleDateString()}</p>}
        {userData.gender && <p><strong>Género:</strong> {userData.gender}</p>}
        <p><strong>Verificado:</strong> {userData.isVerified ? "Sí" : "No"}</p>
      </div>
    </div>
  );
};

export default Perfil;
