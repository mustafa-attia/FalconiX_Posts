import { Button, Input, Spinner } from "@heroui/react";
import { Radio, RadioGroup } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterFormType,
} from "../../../schema/register";
import { registerUser } from "../../../services/auth.services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../utils/errorMessage";

export default function Register() {
  // const [successMsg, setSuccessMsg] = useState("");
  // const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof registerSchema>, unknown, RegisterFormType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  async function submitForm(values: RegisterFormType) {
    // console.log(values);
    // setErrorMsg("");
    // setSuccessMsg("");

    try {
      const res = await registerUser(values);
      // console.log(res);
      // console.log(res.data?.message);
      // setSuccessMsg(res.data.message);
      toast.success(res.data?.message || "Your account has been created.");

      setTimeout(() => {
        navigate("/auth/login")
      }, 1000)

    } catch (error) {

      // console.log(error);
      toast.error(getErrorMessage(error, "Unable to create your account. Please try again."));
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">Join the network</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[color:var(--text)]">
          Create a new account
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">It is quick and easy.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
        <div className="space-y-1.5">
          <Input
            {...register("name")}
            fullWidth
            placeholder="Enter your name"
            type="text"
            aria-label="Name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.name && <p id="register-name-error" className="text-xs font-medium text-[#cf4e49]">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Input
            {...register("username")}
            fullWidth
            placeholder="Enter your username"
            type="text"
            aria-label="Username (optional)"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "register-username-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.username && <p id="register-username-error" className="text-xs font-medium text-[#cf4e49]">{errors.username.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Input
            {...register("email")}
            fullWidth
            placeholder="Enter your email"
            type="email"
            aria-label="Email address"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.email && <p id="register-email-error" className="text-xs font-medium text-[#cf4e49]">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Input
            {...register("dateOfBirth")}
            fullWidth
            placeholder="Enter your dateOfBirth"
            type="date"
            aria-label="Date of birth"
            aria-invalid={Boolean(errors.dateOfBirth)}
            aria-describedby={errors.dateOfBirth ? "register-date-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.dateOfBirth && <p id="register-date-error" className="text-xs font-medium text-[#cf4e49]">{errors.dateOfBirth.message}</p>}
        </div>

        <div className="space-y-2 rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#716d77]">Gender</p>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onChange={field.onChange}
                orientation="horizontal"
                className="gap-4"
              >
                <Radio value="male">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    Male
                  </Radio.Content>
                </Radio>

                <Radio value="female">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    Female
                  </Radio.Content>
                </Radio>
              </RadioGroup>
            )}
          />
          {errors.gender && <p className="text-xs font-medium text-[#cf4e49]">{errors.gender.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Input
            {...register("password")}
            fullWidth
            placeholder="Enter your password"
            type="password"
            aria-label="Password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "register-password-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.password && <p id="register-password-error" className="text-xs font-medium text-[#cf4e49]">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Input
            {...register("rePassword")}
            fullWidth
            placeholder="Confirm password"
            type="password"
            aria-label="Confirm password"
            aria-invalid={Boolean(errors.rePassword)}
            aria-describedby={errors.rePassword ? "register-confirm-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.rePassword && <p id="register-confirm-error" className="text-xs font-medium text-[#cf4e49]">{errors.rePassword.message}</p>}
        </div>

        <Button type="submit" fullWidth isDisabled={isSubmitting} className="mt-2 h-12 rounded-2xl bg-[#204a43] text-sm font-semibold text-white shadow-[0_8px_22px_rgba(32,74,67,0.18)] transition hover:bg-[#286057] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner color="current" /> Creating...
            </div>
          ) : (
            "Create a new account"
          )}
        </Button>
      </form>
    </div>
  );
}
