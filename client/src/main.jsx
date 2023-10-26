import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/templatemo.css";
import "./assets/css/custom.css";
import "./assets/css/fontawesome.min.css";
import "./assets/css/lineaTiempo.css";


import "./assets/js/jquery-1.11.0.min.js";
import "./assets/js/jquery-migrate-1.2.1.min.js";
import "./assets/js/bootstrap.bundle.min.js";
import "./assets/js/bootstrap.min.js";


// import "./assets/js/templatemo.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </React.StrictMode>
);
import "./assets/js/custom.js";
