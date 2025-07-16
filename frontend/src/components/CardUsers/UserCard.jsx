import { useNavigate } from "react-router-dom";
import "./UserCard.css";

function UserCard({ user, type, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="user-card">
      {/* Ícono de usuario en lugar de imagen */}
      <div className="user-card__avatar">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      
      <h2 className="user-card__name">
        {type === "clientes" ? `${user.name} ${user.lastName}` : user.companyName}
      </h2>
      
      <div className="user-card__actions">
        <button
          onClick={() => navigate(`/users/edit/${type}/${user._id}`)}
          className="user-card__button view"
        >
          Ver
        </button>
        <button
          onClick={() => {
            if(window.confirm("¿Querés eliminar este usuario?")) {
              onDelete(user._id)
            }
          }}
          className="user-card__button delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default UserCard;