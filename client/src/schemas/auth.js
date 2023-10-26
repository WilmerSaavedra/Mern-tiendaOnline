import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Ingresa un email valido",
  }),
  password: z.string().min(5, {
    message: "Minimo 5 carateres",
  }),
});

export const registerSchema = z
  .object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(3, {
        message: "Username must be at least 3 characters",
      }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
      
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const sendEmailSchema = z
  .object({
    username: z
      .string({
        message: " ingrese nombre de user",
      })
      .min(3, {
        message: "Username must be at least 3 characters",
      }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    message: z.string().min(6, {
      message: "menssage must be at least 6 characters",
    }),
    subject: z.string().min(6, {
      message: "subject must be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });