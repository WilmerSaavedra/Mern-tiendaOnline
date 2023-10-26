import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonLink } from "./ui/ButtonLink";

import { loginSchema, registerSchema } from "../schemas/auth";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "./ui";
import { HiOutlineLogin } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";
import { useCarrito } from "../context/carritoContext";
import { obtenerCantidadTotalEnCarrito } from "../reducers/utilCarritoReducer";

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
import { ModalLogin } from "./ModalLogin";
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
export function Navbar() {
  const [activeTab, setActiveTab] = useState("login");
  const { listaCarrito } = useCarrito();
  const {
    signin,
    signup,
    logout,
    errors: loginErrors,
    isAuthenticated,
    user,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      closeModal();
    }
  }, [isAuthenticated]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("isModalOpen:", isModalOpen);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
 
  };

  const cantidadProductosEnCarrito =
    obtenerCantidadTotalEnCarrito(listaCarrito);
  return (
    <>
      <ModalLogin isOpen={isModalOpen} closeModal={closeModal} />

      <nav
        className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block"
        id="templatemo_nav_top"
      >
        <div className="container text-light">
          <div className="w-100 d-flex justify-content-between">
            <div>
              <FaEnvelope className="mx-2" />
              <a
                className="navbar-sm-brand text-light text-decoration-none"
                href="mailto:info@company.com"
              >
                info@company.com
              </a>

              <FaPhoneSquareAlt className="mx-2" />
              <a
                className="navbar-sm-brand text-light text-decoration-none"
                href="tel:010-020-0340"
              >
                010-020-0340
              </a>
            </div>
            <div>
              <a
                className="text-light"
                href="https://fb.com/templatemo"
                target="_blank"
                rel="sponsored"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                className="text-light"
                href="https://www.instagram.com/"
                target="_blank"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                className="text-light"
                href="https://twitter.com/"
                target="_blank"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                className="text-light"
                href="https://www.linkedin.com/"
                target="_blank"
              >
                {" "}
                <FaLinkedin className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <nav className="navbar navbar-expand-lg navbar-light shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <a
            className="navbar-brand text-success logo h1 align-self-center"
            href="index.html"
          >
            Zay
          </a>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#templatemo_main_nav"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="align-self-center collapse navbar-collapse flex-fill  d-lg-flex justify-content-lg-between"
            id="templatemo_main_nav"
          >
            <div className="flex-fill">
              <ul className="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                {isAuthenticated ? (
                  <>
                    {user.isAdmin && (
                      <>
                        <li class="nav-item">
                          <NavLink to="/admin/users" className="nav-link">
                            Users
                          </NavLink>
                        </li>
                        <li class="nav-item">
                          <NavLink to="/product" className="nav-link">
                            Products
                          </NavLink>
                        </li>
                        <li class="nav-item">
                          <NavLink to="/ventas" className="nav-link">
                            Ventas
                          </NavLink>
                        </li>
                        <li class="nav-item">
                          <NavLink to="/reportes" className="nav-link">
                            Reportes
                          </NavLink>
                        </li>
                      </>
                    )}
                    {!user.isAdmin && (
                      <>
                        <li className="nav-item">
                          <NavLink to="/" className="nav-link">
                            Home
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/about" className="nav-link">
                            About
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/shop" className="nav-link">
                            Shop
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/contact" className="nav-link">
                            Contact
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/" className="nav-link">
                            Mis compras
                          </NavLink>
                        </li>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink to="/" className="nav-link">
                        Home
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/about" className="nav-link">
                        About
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/shop" className="nav-link">
                        Shop
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/contact" className="nav-link">
                        Contact
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="navbar align-self-center d-flex">
              <div className="d-lg-none flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3"></div>
              {isAuthenticated ? (
                <>
                  <a
                    href="#"
                    className="nav-icon d-none d-lg-inline"
                    to="/register"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <HiOutlineLogin className="text-sm" />
                    <span className="px-2">Salir </span>
                  </a>
                  <Link
                    to="/carrito"
                    className="nav-icon position-relative text-decoration-none"
                  >
                    <i className="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                    <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">
                      {cantidadProductosEnCarrito}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    style={{ boxShadow: "none important!" }}
                    to="#"
                    onClick={toggleModal}
                    className="nav-icon position-relative text-decoration-none"
                  >
                    <i className="fas fa-user"></i>
                    <span className="px-2">Ingresar </span>
                  </Link>
                  {/* {isModalOpen && <ModalLogin isOpen={isModalOpen} closeModal={closeModal} />} */}
                  <Link
                   
                    to="/carrito"
                    className="nav-icon position-relative text-decoration-none"
                  >
                    <i className="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                    <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">
                      {cantidadProductosEnCarrito}
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
