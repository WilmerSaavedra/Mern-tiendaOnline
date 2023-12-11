import React, { useEffect, useState } from "react";
import L from "leaflet";
import { useAuth } from "../context/authContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "leaflet/dist/leaflet.css";
import { sendEmailSchema } from "../schemas/auth";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { Spinner } from "reactstrap";

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(sendEmailSchema),
  });

  useEffect(() => {
    const mymap = L.map("mapid").setView([-23.013104, -43.394365], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    L.marker([-23.013104, -43.394365])
      .addTo(mymap)
      .bindPopup("Location: Lima, Peru")
      .openPopup();

    return () => {
      mymap.remove();
    };
  }, []);
  const { sendEmail, errors: contactErrors, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
//   const watchedValues = watch(["username", "email"]);
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (!user) {
        setValue("username", user.username);
        setValue("email", user.email);
      }
      console.log("data>>>>>>>>>",data)
      await sendEmail(data);

      console.log("eoores", contactErrors);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Finaliza la carga después de recibir una respuesta (éxito o error)
    }
  };

  return (
    <>
      <div className="container-fluid bg-light py-5">
        <div className="col-md-6 m-auto text-center">
          <h1 className="h1">Contact Us</h1>
          <p>
            Proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum. Lorem ipsum dolor sit amet.
          </p>
        </div>
      </div>

      <div
        id="map-container"
        style={{ width: "100%", height: "300px", overflow: "hidden" }}
      >
        <div id="mapid" style={{ width: "100%", height: "100%" }}></div>
      </div>

      <div className="container py-5">
        <div className="row py-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="col-md-9 m-auto"
            method="post"
            role="form"
          >
            <div className="row">
              {contactErrors && <Message message={contactErrors} />}

              <div className="form-group col-md-6 mb-3">
                <label htmlFor="inputname">Name</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  id="name"
                  name="username"
                  placeholder="Name"
                  {...register("username")}
                  value={user ? user.username : ""}
                  readOnly={user ? true : false}
                />
                <p>{errors.username?.message}</p>
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="inputemail">Email</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  id="email"
                  name="email"
                  placeholder="Email"
                  {...register("email")}
                  value={user ? user.email : ""}
                  readOnly={user ? true : false}

                />
                <p>{errors.email?.message}</p>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="inputsubject">Subject</label>
              <input
                type="text"
                className="form-control mt-1"
                id="subject"
                name="subject"
                placeholder="Subject"
                {...register("subject")}
              />
              <p>{errors.subject?.message}</p>
            </div>
            <div className="mb-3">
              <label htmlFor="inputmessage">Message</label>
              <textarea
                className="form-control mt-1"
                id="message"
                name="message"
                placeholder="Message"
                rows="4"
                {...register("message")}
              ></textarea>
              <p>{errors.message?.message}</p>
            </div>
            <div className="row">
              <div className="col text-end mt-2">
                <Button>
                  {isLoading ? (
                    <Spinner color="primary" className="mx-2" /> // Icono de carga
                  ) : (
                    "Enviar mensaje" // Texto del botón
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
