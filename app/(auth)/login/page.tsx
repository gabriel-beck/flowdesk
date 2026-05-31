export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--fd-bg-page)" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: "var(--fd-bg-surface)",
          border: "1px solid var(--fd-border)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--fd-text-primary)", fontFamily: "var(--font-sans)" }}
          >
            flow<span style={{ color: "#0fa474" }}>desk</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--fd-text-secondary)" }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fd-text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "var(--fd-bg-page)",
                border: "1px solid var(--fd-border)",
                color: "var(--fd-text-primary)",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fd-text-secondary)" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "var(--fd-bg-page)",
                border: "1px solid var(--fd-border)",
                color: "var(--fd-text-primary)",
              }}
            />
          </div>
          <a
            href="/"
            className="block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 mt-2"
            style={{ background: "#0fa474", color: "white" }}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
