import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";
import { useForm, useWatch } from "react-hook-form";
import { useAuth } from "../context/authContext";
import { ModalUser } from "../components/user/ModalUser";
import { Alert } from "react-bootstrap";

dayjs.extend(utc);

export function UsuarioForm({ isOpen }) {
  const { reset } = useForm();
  const {
    getUsers,
    deleteUser,
    getUserId,
    updateUser,
    usuario,
    errors: registerErrors,
  } = useAuth();

  const [selectedUsers, setSelectedUsers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);
  const handleDelete = async (UserId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
      });

      if (result.isConfirmed) {
        setSelectedUsers((prevSelected) => ({
          ...prevSelected,
          [UserId]: false,
        }));

        await deleteUser(UserId);

        Swal.fire("Eliminado", "User ha sido eliminado.", "success");
        getUsers();
      }
    } catch (error) {
      console.error("Error al eliminar User:", error);
      let errorMessage = "Hubo un problema al eliminar User.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const selectedUserIds = Object.keys(selectedUsers).filter(
        (UserId) => selectedUsers[UserId]
      );

      if (selectedUserIds.length === 0) {
        Swal.fire(
          "Selecciona Users",
          "Por favor, selecciona Users para eliminar.",
          "info"
        );
        return;
      }

      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlos",
      });

      if (result.isConfirmed) {
        for (const UserId of selectedUserIds) {
          await deleteUser(UserId);
        }

        Swal.fire(
          "Eliminados",
          "Users han sido eliminados.",
          "success"
        );
        getUsers();
        setSelectedUsers({}); // Limpiar la lista de productos seleccionados
      }
    } catch (error) {
      console.error("Error al eliminar Users:", error);
      let errorMessage = "Hubo un problema al eliminar Users.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };
  const handleCheckboxChange = (UserId) => {
    setSelectedUsers((prevSelected) => {
      return {
        ...prevSelected,
        [UserId]: !prevSelected[UserId],
      };
    });
  };
  const toggleModal = (UserId) => {
    if(UserId ===null){
    setEditingUserId(null); 

    }else{setEditingUserId(UserId)}
    
    setIsModalOpen(!isModalOpen);
  };
  const closeModal = () => {
    console.log("cerrando modal")
    setIsModalOpen(false);
    setEditingUserId(null);
    // reset()
    
  };

  return (
    <>
      <div className="shopping-cart section">
        <div className="container">
          <br></br>
          <div className="row">
            <div class="col-md-6  text-start">
              <h1 class=" text-success fs-2">Lista de Users</h1>
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-end">
              <button
                className="btn btn-danger  px-3"
                onClick={handleDeleteSelected}
                disabled={!Object.values(selectedUsers).some((value) => value)}
              >
                Borrar
              </button>
              <button onClick={()=>toggleModal(null)} class="btn btn-success btn-lg px-3">
                Crear User
              </button>
            </div>
            <br></br>
            <br></br>

            <div className="col-12">
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th className="text-start">User</th>
                    <th className="text-start">email</th>
                   
                    <th className="text-start">Accion</th>
                    <th className="text-start">Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {usuario.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <a onClick={() => toggleModal(user._id)} className=" pe-4">
                          <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                        </a>
                        <a onClick={() => handleDelete(user._id)}>
                          <i className="fa-sharp fa-solid fa-trash"></i>
                        </a>
                      </td>
                      <td>
                        <div className="checkProduct">
                          <div className="checkbox">
                            <label
                              className={`checkbox-inline ${
                                selectedUsers[user._id] ? "checked" : ""
                              }`}
                              htmlFor={`checkbox-${user._id}`}
                            >
                              {" "}
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(user._id)
                                }
                                checked={selectedUsers[user._id] || false}
                                id={`checkbox-${user._id}`}
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModalUser isOpen={isModalOpen} closeModal={closeModal} userId={editingUserId} />
    </>
  );
}
