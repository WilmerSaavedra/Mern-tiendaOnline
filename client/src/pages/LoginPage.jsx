import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="container-xl">
    <div className="row">
      <div className="col-md-6 mx-auto p-5">
        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="h1">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} >
          <Input
          className="mb-3"
            label="ingrese su email"
            type="email"
            name="email"
            placeholder="ejemplo@gmail.com"
            {...register("email", { required: true })}
          />
          <p>{errors.email?.message}</p>

          <Input
          label="Ingrese su password"
          className="mb-3"
            type="password"
            name="password"
            placeholder="**********"
            {...register("password", { required: true, minLength: 6 })}
          />
          <p>{errors.password?.message}</p>

          <Button >Login</Button>
        </form>

        <p className="flex gap-x-2 justify-between">
          Don't have an account? <Link to="/register" className="text-sky-500">Sign up</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
