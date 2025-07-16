import { useEffect, useState } from "react";
import UserCard from "../../components/CardUsers/UserCard";
import "./UserList.css";

function UsersList() {

  const [clientes, setClientes] = useState([]);

  const [distribuidores, setDistribuidores] = useState([]);

  useEffect(() => {

    fetch("http://localhost:4000/api/customers")

      .then(res => res.json())

      .then(setClientes);

    fetch("http://localhost:4000/api/distributors")

      .then(res => res.json())

      .then(setDistribuidores);

  }, []);

  const handleDeleteCliente = async (id) => {

    await fetch(`http://localhost:4000/api/customers/${id}`, { method: 'DELETE' });

    setClientes(clientes.filter(c => c._id !== id));

  };

  const handleDeleteDistribuidor = async (id) => {

    await fetch(`http://localhost:4000/api/distributors/${id}`, { method: 'DELETE' });

    setDistribuidores(distribuidores.filter(d => d._id !== id));

  };

  return (
<div className="users-list">

      {clientes.map(c => (
<UserCard key={c._id} user={c} type="clientes" onDelete={handleDeleteCliente} />

      ))}

      {distribuidores.map(d => (
<UserCard key={d._id} user={d} type="distribuidores" onDelete={handleDeleteDistribuidor} />

      ))}
</div>

  );

}
 

export default UsersList;