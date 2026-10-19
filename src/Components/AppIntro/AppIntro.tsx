
const stats = [
  { value: "15", label: "Age" },
  { value: "5+", label: "Years Learning" },
  { value: "20+", label: "Projects" },
  { value: "10+", label: "Technologies" },
  { value: "2", label: "Big Vision" },
]

function AuthIntro() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <span className="brand-mark bg-[color:var(--accent-soft)] text-[#72552e]">Premium network</span>
      <h1 className="mt-5 text-5xl font-black tracking-[-0.08em] text-[color:var(--text)] sm:text-6xl">
        Falconix
      </h1>

      <p className="mt-4 max-w-xl text-xl leading-relaxed text-[#596367] sm:text-2xl">
        Share your thoughts, projects, and ideas with a design-forward community built for deeper conversation.
      </p>

      <div className="premium-card mt-10 overflow-hidden">
        <div className="h-1.5 bg-[#20272b]" />

        <div className="p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#778185]">
            About Falconix
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.06em] text-[color:var(--text)]">
            A place for people, ideas, and meaningful momentum.
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-[#647075]">
            Falconix is a social platform designed to feel immersive and thoughtful, pairing elegant presentation with real conversation and authentic creative work.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-5 transition-all duration-200 hover:border-[#d7c6ab] hover:bg-white"
              >
                <p className="text-2xl font-black tracking-[-0.06em] text-[color:var(--text)]">
                  {stat.value}
                </p>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#778185]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthIntro