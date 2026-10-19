import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter a name with at least 2 characters.")
      .max(50, "Your name must be 50 characters or fewer."),
    username: z
      .string()
      .trim()
      .min(3, "Your username must be at least 3 characters.")
      .max(30, "Your username must be 30 characters or fewer.")
      .regex(/^[a-zA-Z0-9._]+$/, "Use letters, numbers, periods, or underscores only.")
      .or(z.literal(""))
      .transform((value) => value || undefined),
    email: z
      .string()
      .trim()
      .min(1, "Please enter your email address.")
      .email("Please enter a valid email address.")
      .transform((value) => value.toLowerCase()),
    dateOfBirth: z
      .string()
      .min(1, "Please enter your date of birth.")
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

        return true;
      }, "Please enter a valid date of birth.")
      .refine((value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return true;

        const [year, month, day] = value.split("-").map(Number);
        const birthDate = new Date(year, month - 1, day);
        if (
          birthDate.getFullYear() !== year ||
          birthDate.getMonth() !== month - 1 ||
          birthDate.getDate() !== day ||
          birthDate > new Date()
        ) {
          return true;
        }

        const latestEligibleBirthDate = new Date();
        latestEligibleBirthDate.setHours(0, 0, 0, 0);
        latestEligibleBirthDate.setFullYear(latestEligibleBirthDate.getFullYear() - 18);
        return birthDate <= latestEligibleBirthDate;
      }, "You must be at least 18 years old to create an account."),

    gender: z.enum(["male", "female"], {
      message: "Please select your gender.",
    }),
    password: z
      .string()
      .min(8, "Choose a password with at least 8 characters."),
    rePassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine((form) => form.password === form.rePassword, {
    message: "Those passwords don’t match. Please try again.",
    path: ["rePassword"],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
