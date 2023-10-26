import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { PedidoProvider } from "./context/pedidoContext";
import { PagoProvider } from "./context/PagoContext";
import { ProtectedRoute } from "./routes";
import { Footer } from "./components/Footer";
import HomePage from "./pages/HomePage";
import { ProductForm } from "./pages/ProductForm";

import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductPages";
import { ProductProvider } from "./context/productContext";
import { CarritoPages } from "./pages/CarritoPages";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CarritoProvider } from "./context/carritoContext";
import { AboutPages } from "./pages/AboutPages";
import { ContactForm } from "./pages/ContactForm";
import { PagoForm } from "./pages/PagoForm";
import { PedidoForm } from "./pages/PedidoForm";
import { ModalLogin } from "./components/ModalLogin";

function App() {
  return (
    <AuthProvider>
      <PagoProvider>
        <PedidoProvider>
          <ProductProvider>
            <CarritoProvider>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/listar" element={<ProductsPage />} />
                  <Route path="/carrito" element={<CarritoPages />} />
                  <Route
                    path="/detalleProducto"
                    element={<DetalleProducto />}
                  />
                  <Route path="/about" element={<AboutPages />} />
                  <Route path="/product" element={<ProductForm />} />
                  <Route path="/shop" element={<ProductsPage />} />
                  <Route path="/contact" element={<ContactForm />} />
                  <Route path="/pago" element={<PagoForm />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/pedido" element={<PedidoForm />} />
                  </Route>
                  {/* <Route element={<ProtectedRoute />}>
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/add-task" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskFormPage />} />
                  <Route path="/profile" element={<h1>Profiles</h1>} />
                 
                  <Route path="/add-product" element={<ProductFormPage />} />
                  <Route path="/product/:id" element={<ProductsPage />} />
                  <Route path="/profile" element={<h1>Profile</h1>} />
                </Route> */}
                </Routes>
              </BrowserRouter>
            </CarritoProvider>
          </ProductProvider>
          <Footer></Footer>
        </PedidoProvider>
      </PagoProvider>
    </AuthProvider>
  );
}

export default App;
