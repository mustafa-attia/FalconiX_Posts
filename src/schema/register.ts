import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be 50 characters or fewer"),
    username: z
      .string()
      .trim()
      .min(3, "At least 3 characters")
      .max(30, "Username must be 30 characters or fewer")
      .regex(/^[a-zA-Z0-9._]+$/, "Use only letters, numbers, periods, and underscores")
      .or(z.literal(""))
      .transform((value) => value || undefined),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .transform((value) => value.toLowerCase()),
    dateOfBirth: z
      .string()
      .min(1, "Enter your date of birth")
      .refine((value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return false;
        }

        const [year, month, day] = value.split("-").map(Number);
        const birthDate = new Date(year, month - 1, day);
        if (
          birthDate.getFullYear() !== year ||
          birthDate.getMonth() !== month - 1 ||
          birthDate.getDate() !== day ||
          birthDate > new Date()
        ) {
          return false;
        }

        const latestEligibleBirthDate = new Date();
        latestEligibleBirthDate.setHours(0, 0, 0, 0);
        latestEligibleBirthDate.setFullYear(latestEligibleBirthDate.getFullYear() - 18);
        return birthDate <= latestEligibleBirthDate;
      }, "You must be at least 18 years old"),

    gender: z.enum(["male", "female"], {
      message: "Please choose a gender",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must contain 8+ characters, uppercase, lowercase, number, and special character",
      ),
    rePassword: z
      .string()
      .min(1, "Confirm your password"),
  })
  .refine((form) => form.password === form.rePassword, {
    message: "passwords didn't match",
    path: ["rePassword"],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
