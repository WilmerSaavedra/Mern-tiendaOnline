import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input } from "../components/ui";
// import { resetPasswordSchema } from "../schemas/auth"; // Asegúrate de tener un esquema para la validación

export function ResetLoginForm() {
  const navigate = useNavigate();
  const [resetSuccessful, setResetSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    
    try {
   
      setResetSuccessful(true);
    } catch (error) {
      
      console.error("Error al enviar la solicitud de restablecimiento de contraseña", error);
    }
  };

  return (
    <div className="container-xl">
      <div className="row">
        <div className="col-md-6 mx-auto p-5">
          <h1 className="h1">Reset Password</h1>

          {!resetSuccessful ? (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  className="mb-3"
                  label="Ingrese su email"
                  type="email"
                  name="email"
                  placeholder="ejemplo@gmail.com"
                  {...register("email", { required: true })}
                />
                <p>{errors.email?.message}</p>

                <Button>Enviar solicitud de restablecimiento</Button>
              </form>
            </>
          ) : (
            <Message type="success" message="Solicitud de restablecimiento de contraseña enviada. Revise su correo electrónico para obtener instrucciones." />
          )}

          <p className="flex gap-x-2 justify-between">
            Recuerdas tu contraseña? <Link to="/login" className="text-sky-500">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
