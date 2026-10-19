import * as z from "zod";

export const loginSchema = z
  .object({
    email: z
      .email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain 8+ characters, uppercase, lowercase, number, and special character",
      ),
  });   
    ;

export type LoginFormType = z.infer<typeof loginSchema>;
