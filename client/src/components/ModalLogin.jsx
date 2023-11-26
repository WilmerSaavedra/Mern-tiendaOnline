import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, registerSchema } from "../schemas/auth";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "./ui";
import { HiOutlineLogin } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";
import { useCarrito } from "../context/carritoContext";
import { obtenerCantidadTotalEnCarrito } from "../reducers/utilCarritoReducer";
import {Modals} from "../components/ui"

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

export function ModalLogin({isOpen, closeModal }) {
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: userRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    signin,
    signup,
    errors: loginErrors,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      closeModal();
      reset()
    }
  }, [isAuthenticated]);

  const handleRegister = async (value) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(value);
      
    } catch (error) {
      resetRegisterForm();
      // Manejar errores aquí
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (data) => {
    if (isSubmitting) {
      return;
    }

    try {
      await signin(data);
      if (isAuthenticated) {
        closeModal();
      }
    } catch (error) {
      // Manejar errores aquí
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modals  isOpen={isOpen} closeModal={closeModal} size="md">
      <MDBNavbar
        className="nav nav-pills nav-justified mb-3"
        style={{ boxShadow: "none" }}
      >
        <MDBNavbarItem style={{}}>
          <MDBNavbarLink
            onClick={() => toggleTab("login")}
            active={activeTab === "login"}
            style={
              activeTab === "login"
                ? { backgroundColor: "#59AB6E", color: "#fff" }
                : {}
            }
          >
            Login
          </MDBNavbarLink>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBNavbarLink
            onClick={() => toggleTab("register")}
            active={activeTab === "register"}
            style={
              activeTab === "register"
                ? { backgroundColor: "#59AB6E", color: "#fff" }
                : {}
            }
          >
            Register
          </MDBNavbarLink>
        </MDBNavbarItem>
      </MDBNavbar>

      <MDBTabsContent>
        <MDBTabsPane show={activeTab === "login"}>
          <form onSubmit={handleSubmit(handleLogin)}>
            {loginErrors && <Message message={loginErrors} />}
            <div className="text-center mb-3">
              <p>Ingresar con:</p>
              <MDBBtn color="link" className="btn-floating mx-1">
                <FaFacebookF />
              </MDBBtn>

              <MDBBtn color="link" className="btn-floating mx-1">
                <FaGoogle />
              </MDBBtn>

              <MDBBtn color="link" className="btn-floating mx-1">
                <FaTwitter />
              </MDBBtn>

              <MDBBtn color="link" className="btn-floating mx-1">
                <FaLinkedin />
              </MDBBtn>
            </div>

            <p className="text-center">or:</p>

            <MDBInput
              className="mb-2"
              type="email"
              label="Email or username"
              id="loginName"
              name="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email?.message}</p>
            )}
            <MDBInput
              className="mb-2"
              type="password"
              label="Password"
              id="loginPassword"
              name="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password?.message}</p>
            )}
            <MDBBtn
              disabled={isSubmitting}
              className="mb-2"
              color="success"
              block
            >
              Ingresar
            </MDBBtn>

            <div className="text-center">
              <p>
                Olvido su clave? <a href="#!">Recuperar</a>
              </p>
            </div>
          </form>
        </MDBTabsPane>
        <MDBTabsPane show={activeTab === "register"}>
          <form onSubmit={handleLoginSubmit(handleRegister)}>
            {loginErrors && <Message message={loginErrors} />}
            <div className="text-center mb-3">
              <p>Registrar con:</p>
              <MDBBtn color="link" className="btn-floating mx-1">
                <FaFacebookF />
              </MDBBtn>

              <MDBBtn color="link" className="btn-floating mx-1">
                <FaGoogle />
              </MDBBtn>

              <MDBBtn color="link" className="btn-floating mx-1">
                <FaTwitter />
              </MDBBtn>

              <MDBBtn color="link" className="btn-floating mx-1">
                <FaLinkedin />
              </MDBBtn>
            </div>

            <p className="text-center">or:</p>
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

            <MDBBtn
              disabled={isSubmitting}
              className="mb-2"
              color="success"
              block
            >
              Registarme
            </MDBBtn>
          </form>
        </MDBTabsPane>
      </MDBTabsContent>
    </Modals>
  );
}
