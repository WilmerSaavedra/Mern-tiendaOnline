import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, registerSchema } from "../../schemas/auth";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Card, Message, Button, Input, Label } from ".././ui";
import { HiOutlineLogin } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";
import { Modals } from "../../components/ui";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhoneSquareAlt,
  FaUserCircle,
  FaShoppingCart,
  FaMinus,
  FaGoogle,
} from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBNavbar,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import { ModalTitle } from "react-bootstrap";

export function ModalUser({ isOpen, closeModal, userId }) {
  const [activeTab, setActiveTab] = useState("login");
  const [modalTitle, setModalTitle] = useState("Crear Marca");
  
  const {
    setValue,
    getValues,
    register: userRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    signin,
    signup,

    errors: loginErrors,
    isAuthenticated,
    getUsers,
    getUserId,
  } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId !== null) {
          setModalTitle("Editar User");
          const MarcaInfo = await getUserId(userId);
          console.log("MarcaInfo>>>>>>", MarcaInfo);
          setValue("username", MarcaInfo.username);
          setValue("email", MarcaInfo.email);
        } else {
          setModalTitle("Crear User");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!userId) {
      reset();
    }
    fetchData();
  }, [getUserId, userId, setValue, watch]);
 

  const handleRegister = async (value) => {
    try {
      const isLogin = await signup(value);
console.log("isLogin",isLogin)
      if (isLogin!=null) {
        closeModal();
      }
    } catch (error) {
      resetRegisterForm();
      // Manejar errores aquí
    } finally {
      getUsers();
    }
  };

  return (
    <Modals isOpen={isOpen} closeModal={closeModal} size="md">
      <form onSubmit={handleLoginSubmit(handleRegister)}>
        {loginErrors && <Message message={loginErrors} />}

        <h2>{modalTitle}</h2>
        <br></br>
        <MDBInput
          className="mb-4"
          type="text"
          label="Username"
          id="registerUsername"
          name="username"
          {...userRegister("username")}
          autoFocus
        />
        {registerErrors.username?.message && (
          <p className="text-red-500">{registerErrors.username?.message}</p>
        )}
        <MDBInput
          className="mb-4"
          type="email"
          label="Email"
          id="registerEmail"
          name="email"
          {...userRegister("email")}
        />
        {registerErrors.email?.message && (
          <p className="text-red-500">{errors.email?.message}</p>
        )}

        <MDBInput
          className="mb-4"
          type="password"
          label="Password"
          name="password"
          id="registerPassword"
          {...userRegister("password")}
        />
        {registerErrors.password?.message && (
          <p className="text-red-500">{registerErrors.password?.message}</p>
        )}
        <MDBInput
          className="mb-4"
          type="password"
          label="Repeat password"
          id="registerRepeatPassword"
          name="confirmPassword"
          {...userRegister("confirmPassword")}
        />
        {registerErrors.confirmPassword?.message && (
          <p className="text-red-500">
            {registerErrors.confirmPassword?.message}
          </p>
        )}

        <MDBBtn className="mb-2" color="success" block>
          Guardar
        </MDBBtn>
      </form>
    </Modals>
  );
}
