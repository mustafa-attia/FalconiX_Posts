import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "At least 3 characters")
      .max(10, "At most 10 characters"),
    username: z
      .string()
      .min(3, "At least 3 characters")
      .max(10, "At most 10 characters")
      .optional(),
    email: z
      .email("Invalid email")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ),
    dateOfBirth: z.string().refine((value) => {
      return new Date().getFullYear() - new Date(value).getFullYear() >= 18;
    }, "age must be greater than 18 "),

    gender: z.enum(["male", "female"], {
      message: "Please choose a gender",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain 8+ characters, uppercase, lowercase, number, and special character",
      ),
    rePassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain 8+ characters, uppercase, lowercase, number, and special character",
      ),
  })
  .refine((form) => form.password === form.rePassword, {
    message: "passwords didn't match",
    path: ["rePassword"],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
