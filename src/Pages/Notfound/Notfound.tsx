
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--page-bg)] px-4 py-10">
      <div className="premium-card w-full max-w-lg p-8 text-center">
        <span className="brand-mark bg-[color:var(--accent-soft)] text-[color:var(--primary)]">404</span>
        <h1 className="mt-5 text-4xl font-bold tracking-[-0.06em] text-[color:var(--text)] sm:text-5xl">Page missing</h1>
        <p className="mt-3 text-base leading-7 text-[color:var(--muted)]">
          The route you are looking for no longer exists or may have moved.
        </p>
        <Link to="/" className="primary-button mx-auto mt-6">
          <ArrowLeft size={16} />
          Back home
        </Link>
      </div>
    </main>
  );
}
