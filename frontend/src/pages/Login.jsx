import { useEffect, useState } from "react";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  GitFork,
  LayoutDashboard,
  LockKeyhole,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const API_URL = "http://localhost:8000";

function Login() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setCheckingAuth(true);
        setAuthError("");

        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          setUser(data.user || data || null);
          return;
        }

        setUser(null);
      } catch (error) {
        console.error("Authentication check failed:", error);

        setUser(null);

        setAuthError(
          "Unable to verify your session. Please check that the backend is running."
        );
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleGitHubLogin = () => {
    if (connecting) return;

    setConnecting(true);

    window.location.href = `${API_URL}/auth/github`;
  };

  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#070b1a] text-white selection:bg-blue-500/30">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[620px] h-[620px] rounded-full bg-blue-600/[0.08] blur-3xl" />

        <div className="absolute -bottom-48 -right-48 w-[620px] h-[620px] rounded-full bg-violet-600/[0.08] blur-3xl" />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-cyan-500/[0.025] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-[#070b1a]/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto h-16 px-5 sm:px-6 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Code2 size={20} />
            </div>

            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-100">
                Internal Developer Platform
              </h1>

              <p className="text-[11px] text-slate-500 mt-0.5">
                Deploy. Monitor. Scale.
              </p>
            </div>
          </div>

          {/* Platform status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform operational
            </div>

            {user && (
              <div className="flex items-center gap-2.5">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.login || "User"}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-xs font-semibold text-slate-400">
                      {(user.login || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="hidden md:block">
                  <p className="text-xs font-medium text-slate-300">
                    {user.name || user.login}
                  </p>

                  <p className="text-[10px] text-slate-600">
                    @{user.login}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-6 py-10 lg:py-16">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          {/* Left section */}
          <section className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/15 bg-blue-500/[0.06] text-xs text-blue-300">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-blue-400 opacity-60 animate-ping" />

                <span className="relative inline-flex w-2 h-2 rounded-full bg-blue-400" />
              </span>

              Developer Infrastructure Platform
            </div>

            {/* Heading */}
            <h2 className="mt-7 text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.08] tracking-tight text-slate-100">
              Build and ship.

              <span className="block mt-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Without infrastructure friction.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-8 text-slate-400">
              Connect repositories, deploy applications,
              track releases and monitor infrastructure
              from one engineering workspace.
            </p>

            {/* Capability cards */}
            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-800 bg-[#0d1426]/60">
                <div className="w-8 h-8 rounded-lg bg-blue-500/[0.08] text-blue-400 flex items-center justify-center">
                  <GitFork size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-300">
                    Repositories
                  </p>

                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Source integration
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-800 bg-[#0d1426]/60">
                <div className="w-8 h-8 rounded-lg bg-violet-500/[0.08] text-violet-400 flex items-center justify-center">
                  <Zap size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-300">
                    Deployments
                  </p>

                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Release automation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-800 bg-[#0d1426]/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/[0.08] text-emerald-400 flex items-center justify-center">
                  <Activity size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-300">
                    Monitoring
                  </p>

                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Service visibility
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />

                Repository integration
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />

                Automated deployments
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />

                Infrastructure monitoring
              </div>
            </div>
          </section>

          {/* Authentication section */}
          <section className="w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative rounded-2xl border border-slate-800 bg-[#0d1426]/90 overflow-hidden shadow-2xl shadow-black/30">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              <div className="p-6 sm:p-7">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-7">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/15">
                      <Code2 size={21} />
                    </div>

                    <h3 className="mt-4 text-xl font-semibold">
                      {checkingAuth
                        ? "Checking workspace"
                        : user
                          ? "Welcome back"
                          : "Access workspace"}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      {checkingAuth
                        ? "Verifying your secure session."
                        : user
                          ? `Signed in as @${user.login}`
                          : "Authenticate with GitHub to continue."}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-[10px] uppercase tracking-wider text-slate-500">
                    <LockKeyhole size={12} />
                    Secure
                  </div>
                </div>

                {/* Loading */}
                {checkingAuth && (
                  <div className="space-y-3">
                    <div className="h-16 rounded-xl border border-slate-800 bg-slate-900/40 animate-pulse" />

                    <div className="h-11 rounded-xl bg-slate-800/70 animate-pulse" />

                    <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-600">
                      <RefreshCw
                        size={13}
                        className="animate-spin"
                      />

                      Verifying session
                    </div>
                  </div>
                )}

                {/* Error */}
                {!checkingAuth && authError && (
                  <div className="rounded-xl border border-red-500/15 bg-red-500/[0.05] p-4">
                    <p className="text-sm font-medium text-red-400">
                      Connection issue
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {authError}
                    </p>

                    <button
                      type="button"
                      onClick={handleRetry}
                      className="mt-3 inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition"
                    >
                      <RefreshCw size={13} />

                      Retry connection
                    </button>
                  </div>
                )}

                {/* Authenticated */}
                {!checkingAuth && user && (
                  <>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                      <div className="flex items-center gap-3 p-4">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.login || "User"}
                            className="w-11 h-11 rounded-full border border-slate-700 object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-semibold">
                            {(user.login || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-200 truncate">
                            {user.name || user.login}
                          </p>

                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            @{user.login}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/10 text-[10px] font-medium text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                          Connected
                        </div>
                      </div>

                      <div className="border-t border-slate-800 px-4 py-3 flex items-center justify-between">
                        <span className="text-[11px] text-slate-600">
                          Authentication provider
                        </span>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <GitFork size={13} />

                          GitHub OAuth
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoToDashboard}
                      className="group mt-5 w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:brightness-110 hover:-translate-y-px active:translate-y-0 transition-all"
                    >
                      <LayoutDashboard size={17} />

                      Open Dashboard

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </>
                )}

                {/* Unauthenticated */}
                {!checkingAuth && !user && (
                  <>
                    <button
                      type="button"
                      onClick={handleGitHubLogin}
                      disabled={connecting}
                      className="group w-full h-12 rounded-xl bg-white text-slate-950 text-sm font-semibold flex items-center justify-center gap-2.5 hover:bg-slate-100 hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {connecting ? (
                        <>
                          <RefreshCw
                            size={17}
                            className="animate-spin"
                          />

                          Connecting...
                        </>
                      ) : (
                        <>
                          <GitFork size={18} />

                          Continue with GitHub

                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
                      You will be redirected to GitHub to
                      securely authenticate your account.
                    </p>
                  </>
                )}

                {/* Security footer */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-600">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-400/80"
                  />

                  Secure authentication powered by GitHub OAuth
                </div>
              </div>
            </div>

            {/* Service status */}
            <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl border border-slate-800 bg-[#0d1426]/50">
              <div className="flex items-center gap-2">
                <Server
                  size={14}
                  className="text-blue-400"
                />

                <span className="text-xs text-slate-500">
                  Platform services
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                Operational
              </div>
            </div>
          </section>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-5 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <p>Internal Developer Platform</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Secure access
            </span>

            <span className="flex items-center gap-1.5">
              <Sparkles size={12} />
              Developer workspace
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;