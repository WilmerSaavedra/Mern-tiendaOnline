import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { PedidoProvider } from "./context/pedidoContext";
import { PagoProvider } from "./context/PagoContext";
import { ProtectedRoute } from "./routes";
import { Footer } from "./components/Footer";
import HomePage from "./pages/HomePage";
import { ProductForm } from "./pages/ProductForm";
import { MarcaForm } from "./pages/MarcaForm";
import { ClienteForm } from "./pages/ClienteForm";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductPages";
import { MarcaProvider } from "./context/marcaContext";
import { ClienteProvider } from "./context/clienteContext";
import { ProductProvider } from "./context/productContext";
import { CarritoPages } from "./pages/CarritoPages";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CarritoProvider } from "./context/carritoContext";
import { AboutPages } from "./pages/AboutPages";
import { ContactForm } from "./pages/ContactForm";
import { PagoForm } from "./pages/PagoForm";
import { PedidoForm } from "./pages/PedidoForm";
import { ModalLogin } from "./components/ModalLogin";
import { UsuarioForm } from "./pages/UsuarioForm";
import { OrdenForm } from "./pages/OrdenForm";
import { UserForm } from "./pages/UserForm";
import {OrdenPages} from "./pages/OrdenPages";
import PedidoPages from "./pages/PedidoPages";

function App() {
  return (
    <AuthProvider>
      <ClienteProvider>
      <PagoProvider>
        <PedidoProvider>
          <MarcaProvider>
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

                    <Route element={<ProtectedRoute />}>
                      <Route path="/product" element={<ProductForm />} />
                      <Route path="/isCliente/:idCliente?" element={<UserForm />} />
                      <Route path="/crudpedido/:pedidoId?" element={<OrdenPages />} />
                      <Route path="/cliente" element={<ClienteForm />} />
                      <Route path="/marca" element={<MarcaForm />} />
                      <Route path="/user" element={<UsuarioForm />} />
                      <Route path="/orden" element={<OrdenForm />} />
                    </Route>
                    <Route path="/shop" element={<ProductsPage />} />
                    <Route path="/pedidos" element={<PedidoPages />} />
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
          </MarcaProvider>
          <Footer></Footer>
        </PedidoProvider>
      </PagoProvider>
      </ClienteProvider>
    </AuthProvider>
  );
}

export default App;
