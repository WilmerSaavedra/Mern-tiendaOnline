import { NavLink } from "react-router-dom";
import { useProducts } from "../../context/productContext";
import { useCarrito } from "../../context/carritoContext";
import { obtenerCantidadTotalEnCarrito } from "../../reducers/utilCarritoReducer";
import { Button, ButtonLink, Card } from "../ui";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function ProductCard({ products }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { deleteProduct } = useProducts();
  const { agregarCompra, listaCarrito, actualizarCarrito } = useCarrito();
  useEffect(() => {
    const carritoEnSession = sessionStorage.getItem("listaCarrito");
    if (carritoEnSession && JSON.parse(carritoEnSession).length > 0) {
      const parsedCarrito = JSON.parse(carritoEnSession);
      actualizarCarrito(parsedCarrito);
    }
  }, []);

  const clickAgregar = (event) => {
    event.preventDefault();

    const productoExistente = listaCarrito.find(
      (item) => item._id === products._id
    );

    if (productoExistente) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      const nuevoCarrito = listaCarrito.map((item) => {
        if (item._id === products._id) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      });
      actualizarCarrito(nuevoCarrito);
      sessionStorage.setItem("listaCarrito", JSON.stringify(nuevoCarrito));
      // Agregar la notificación aquí
      toast.success(`               ${products.nombre},añadido al carrito`, {
        icon: ({ theme, type }) => (
          <img
            src={products.image.principal.url}
            style={{ width: "20px", height: "20px" }}
          />
        ),
      });
    } else {
      // Si el producto no está en el carrito, agrégalo con cantidad 1
      agregarCompra({ ...products, cantidad: 1 });
      const nuevoCarrito = [...listaCarrito, { ...products, cantidad: 1 }];
      actualizarCarrito(nuevoCarrito);
      sessionStorage.setItem("listaCarrito", JSON.stringify(nuevoCarrito));
      // Agregar la notificación aquí
      toast.success(`${products.nombre},añadido al carrito`, {
        icon: ({ theme, type }) => (
          <img
            src={products.image.principal.url}
            style={{ width: "20px", height: "20px" }}
          />
        ),
      });
    }
  };
  const cantidadProductosEnCarrito =
    obtenerCantidadTotalEnCarrito(listaCarrito);

  const handleImageLoad = () => {
    // Se llama cuando la imagen principal se ha cargado.
    setImageLoaded(true);
  };
  return (
    <Card>
      <div className="card mb-4 product-wap rounded-0">
        <div className="card rounded-0">
          {!imageLoaded && <img src="../src/assets/img/apple-icon.png" alt="Loading" />}
          <img
            src={products.image.principal.url}
            alt="Product"
            style={{ display: imageLoaded ? "block" : "none" }}
            onLoad={handleImageLoad}
          />
          <div className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
            <ul className="list-unstyled">
              <li>
                <a
                  href="shop-single.html"
                  className="btn btn-success text-white"
                >
                  <i className="far fa-heart"></i>
                </a>
              </li>
              <li>
                <NavLink
                  to="/detalleProducto"
                  href="shop-single.html"
                  className="btn btn-success text-white mt-2"
                >
                  <i className="far fa-eye"></i>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={clickAgregar}
                  // to="/carrito"
                  href="shop-single.html"
                  className="btn btn-success text-white mt-2"
                >
                  <i className="fas fa-cart-plus"></i>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="card-body">
          <a href="shop-single.html" className="h3 text-decoration-none">
            {products.nombre}
          </a>
          <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">
            <li>{products.descripcion}</li>
            <li className="pt-2 ">
              <span className="product-color-dot color-dot-red rounded-full ml-1"></span>
              <span className="product-color-dot color-dot-blue rounded-full ml-1"></span>
              <span className="product-color-dot color-dot-black rounded-full ml-1"></span>
              <span className="product-color-dot color-dot-light rounded-full ml-1"></span>
              <span className="product-color-dot color-dot-green rounded-full ml-1"></span>
            </li>
          </ul>
          <ul className="list-unstyled d-flex justify-content-center mb-1">
            <li className="">
              <i className="text-warning fas fa-star"></i>
              <i className="text-warning fas fa-star"></i>
              <i className="text-warning fas fa-star"></i>
              <i className="text-muted fas fa-star"></i>
              <i className="text-muted fas fa-star"></i>
            </li>
          </ul>
          <p className="text-center mb-0">$ {products.precio}</p>
        </div>
      </div>
    </Card>
  );
}
