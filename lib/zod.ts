import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = object({
  firstName: string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(32, "First name must be less than 32 characters"),
  secondName: string({ required_error: "Second name is required" })
    .min(1, "Second name is required")
    .max(32, "Second name must be less than 32 characters"),
  firstLastName: string({ required_error: "First last name is required" })
    .min(1, "First last name is required")
    .max(32, "First last name must be less than 32 characters"),
  secondLastName: string({ required_error: "Second last name is required" })
    .min(1, "Second last name is required")
    .max(32, "Second last name must be less than 32 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
});
