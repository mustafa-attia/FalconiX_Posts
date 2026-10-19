import { Button, Input, Spinner } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import {
  loginSchema,
  type LoginFormType,
} from "../../../schema/login";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/auth.services";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../utils/errorMessage";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readAuthToken(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  if (typeof payload.token === "string" && payload.token.length > 0) return payload.token;
  return isRecord(payload.data) ? readAuthToken(payload.data) : null;
}

export default function Login() {

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { updateToken } = useContext(AuthContext)


  async function submitForm(values: LoginFormType) {
    // console.log(values);

    try {
      const res = await loginUser(values);
      // console.log(res);
      // console.log(res.data?.message);

      // console.log(res.data?.data?.token);

      // localStorage.setItem("userToken", res.data.data.token);
      const responseData: unknown = res.data;
      const token = readAuthToken(responseData);
      if (!token) {
        throw new Error("Sign in succeeded without returning an authentication token.");
      }
      updateToken(token);

      const message = isRecord(responseData) && typeof responseData.message === "string"
        ? responseData.message
        : "Welcome back.";
      toast.success(message);
      navigate("/");
      
    } catch (error) {

      // console.log(error);
      toast.error(getErrorMessage(error, "Unable to sign in. Please check your details and try again."));
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[color:var(--text)]">
          Login to Falconix
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">Log in and continue your social journey.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
        <div className="space-y-1.5">
          <Input
            {...register("email")}
            fullWidth
            placeholder="Enter your email"
            type="email"
            aria-label="Email address"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.email && (
            <p id="login-email-error" className="text-xs font-medium text-[#cf4e49]">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Input
            {...register("password")}
            fullWidth
            placeholder="Enter your password"
            type="password"
            aria-label="Password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className="min-h-[52px] rounded-2xl border border-[#dce7e2] bg-[#f3f7f5] text-[#1d302d] placeholder:text-[#71817d] focus-within:border-[#78aa9c] focus-within:ring-4 focus-within:ring-[#287a6b]/10"
          />
          {errors.password && (
            <p id="login-password-error" className="text-xs font-medium text-[#cf4e49]">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" fullWidth isDisabled={isSubmitting} className="mt-2 h-12 rounded-2xl bg-[#204a43] text-sm font-semibold text-white shadow-[0_8px_22px_rgba(32,74,67,0.18)] transition hover:bg-[#286057] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner color="current" /> Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
}
