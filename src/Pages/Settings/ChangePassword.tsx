import { useContext, useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword } from "../../services/auth.services";
import { AuthContext } from "../../context/AuthContext";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePassword() {
  const { updateToken } = useContext(AuthContext);
  const [form, setForm] = useState(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  function updateField(field: keyof typeof defaultValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.currentPassword.trim() || !form.newPassword.trim() || !form.confirmPassword.trim()) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New password should contain at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Password confirmation does not match the new password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await changePassword({
        password: form.currentPassword,
        newPassword: form.newPassword,
      });
      const refreshedToken = response.data?.token ?? response.token;
      if (refreshedToken) {
        updateToken(refreshedToken);
      }
      toast.success("Password updated successfully.");
      setForm(defaultValues);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update password.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="premium-card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <LockKeyhole size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Security</p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Change password</h1>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { key: "currentPassword", label: "Current password", placeholder: "Enter current password", type: show.current ? "text" : "password" },
            { key: "newPassword", label: "New password", placeholder: "Enter new password", type: show.new ? "text" : "password" },
            { key: "confirmPassword", label: "Confirm password", placeholder: "Repeat new password", type: show.confirm ? "text" : "password" },
          ].map((field) => (
            <div key={field.key}>
              <label className="mb-2 block text-sm font-medium text-[#40534e]">{field.label}</label>
              <div className="relative">
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(event) => updateField(field.key as keyof typeof defaultValues, event.target.value)}
                  placeholder={field.placeholder}
                  className="field-shell pr-11"
                />
                <button
                  type="button"
                  aria-label={`Toggle ${field.label}`}
                  onClick={() => setShow((prev) => ({ ...prev, [field.key.replace("Password", "")]: !prev[field.key.replace("Password", "") as keyof typeof prev] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                >
                  {field.type === "password" ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-start gap-2">
              <ShieldCheck size={18} className="mt-0.5 shrink-0" />
              <span>
                Choose a strong password that you do not use elsewhere.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button w-full rounded-2xl py-3"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
