import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .refine((value) => value.length > 0 && value.trim().length > 0, "Please enter your password."),
});

export type LoginFormType = z.infer<typeof loginSchema>;
