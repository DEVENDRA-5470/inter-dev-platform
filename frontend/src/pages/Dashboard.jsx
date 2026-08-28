import { useEffect, useState } from "react";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  GitFork,
  LayoutDashboard,
  LogOut,
  Rocket,
  Server,
  Settings2,
  ShieldCheck,
  User,
  XCircle,
  Zap,
} from "lucide-react";

const API_URL = "http://localhost:8000";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          window.location.replace("/");
          return;
        }

        const data = await response.json();

        if (!data?.user) {
          window.location.replace("/");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          "Failed to fetch authenticated user:",
          error
        );

        window.location.replace("/");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch(
        `${API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const handleRepositories = () => {
    window.location.href = "/repositories";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b1a] text-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6">
          <div className="h-20 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-800 animate-pulse" />

              <div className="space-y-2">
                <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-28 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>

            <div className="h-10 w-24 bg-slate-800 rounded-xl animate-pulse" />
          </div>

          <main className="py-10">
            <div className="space-y-4 mb-10">
              <div className="w-72 h-10 bg-slate-800 rounded animate-pulse" />
              <div className="w-[500px] max-w-full h-5 bg-slate-800 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-[#11182b] border border-slate-800 animate-pulse"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[420px] rounded-2xl bg-[#11182b] border border-slate-800 animate-pulse" />

              <div className="h-[420px] rounded-2xl bg-[#11182b] border border-slate-800 animate-pulse" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-250px] top-[-250px] h-[650px] w-[650px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-[-250px] bottom-[-250px] h-[650px] w-[650px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-30 sticky top-0 border-b border-slate-800 bg-[#0c1224]/90 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand */}
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutDashboard size={22} />
            </div>

            <div>
              <h1 className="font-semibold text-base">
                Internal Developer Platform
              </h1>

              <p className="text-xs text-slate-400">
                Engineering Control Plane
              </p>
            </div>
          </button>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-400">
              <CircleDot
                size={14}
                className="animate-pulse"
              />
              Platform operational
            </div>

            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-800">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user?.login || "User"}
                  className="w-9 h-9 rounded-full border border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center">
                  <User
                    size={18}
                    className="text-slate-400"
                  />
                </div>
              )}

              <div className="hidden xl:block">
                <p className="text-sm font-medium">
                  {user?.name || user?.login || "User"}
                </p>

                <p className="text-xs text-slate-500">
                  @{user?.login || "account"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
            >
              <LogOut size={17} />

              <span className="hidden sm:inline">
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1440px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-7">
          <span>Workspace</span>

          <ChevronRight size={15} />

          <span className="text-slate-300">
            Overview
          </span>
        </div>

        {/* Hero */}
        <section className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-400 mb-5">
              <CheckCircle2 size={15} />
              GitHub integration active
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Good to see you,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                {" "}
                {user?.name || user?.login || "Developer"}
              </span>
            </h2>

            <p className="text-slate-400 mt-3 text-lg max-w-2xl">
              Manage source code, deployment workflows and
              platform infrastructure from one operational
              workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRepositories}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-500/20"
          >
            <GitFork size={18} />
            Manage repositories
            <ArrowRight size={17} />
          </button>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {/* Account */}
          <div className="bg-[#11182b]/90 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Connected Account
                </p>

                <p className="text-lg font-semibold mt-2 truncate max-w-[180px]">
                  {user?.login || "GitHub"}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <GitFork size={19} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 text-xs text-emerald-400">
              <CheckCircle2 size={14} />
              Authentication active
            </div>
          </div>

          {/* Repositories */}
          <button
            type="button"
            onClick={handleRepositories}
            className="text-left bg-[#11182b]/90 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 hover:bg-blue-500/[0.03] transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Source Control
                </p>

                <p className="text-lg font-semibold mt-2">
                  Repositories
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <GitFork size={19} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 text-xs text-blue-400">
              Open management console

              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition"
              />
            </div>
          </button>

          {/* Deployments */}
          <div className="bg-[#11182b]/90 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Delivery
                </p>

                <p className="text-lg font-semibold mt-2">
                  Deployments
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <Rocket size={19} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 text-xs text-slate-500">
              <Clock3 size={14} />
              Ready to configure
            </div>
          </div>

          {/* Monitoring */}
          <div className="bg-[#11182b]/90 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Observability
                </p>

                <p className="text-lg font-semibold mt-2">
                  Monitoring
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Activity size={19} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 text-xs text-slate-500">
              <Clock3 size={14} />
              Ready to configure
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Platform Modules */}
          <div className="xl:col-span-2 bg-[#11182b]/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h3 className="font-semibold text-lg">
                  Platform Modules
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Manage engineering workflows from a single
                  control plane.
                </p>
              </div>

              <Settings2
                size={20}
                className="text-slate-500"
              />
            </div>

            <div className="divide-y divide-slate-800">
              {/* Repository Management */}
              <button
                type="button"
                onClick={handleRepositories}
                className="w-full flex items-center gap-4 p-6 text-left hover:bg-blue-500/[0.03] transition group"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <GitFork size={21} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">
                    Repository Management
                  </h4>

                  <p className="text-sm text-slate-400 mt-1">
                    Browse, search and manage repositories
                    connected to your GitHub account.
                  </p>
                </div>

                <ArrowRight
                  size={19}
                  className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition"
                />
              </button>

              {/* Deployment */}
              <div className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                  <Rocket size={21} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-medium">
                      Deployment Management
                    </h4>

                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Not configured
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mt-1">
                    Connect Kubernetes, cloud infrastructure or
                    CI/CD pipelines to enable deployments.
                  </p>
                </div>

                <Clock3
                  size={19}
                  className="text-slate-600"
                />
              </div>

              {/* Monitoring */}
              <div className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Activity size={21} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-medium">
                      Monitoring & Observability
                    </h4>

                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Not configured
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mt-1">
                    Connect metrics, logs and alerting systems to
                    monitor workloads.
                  </p>
                </div>

                <Clock3
                  size={19}
                  className="text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Platform Status */}
          <div className="bg-[#11182b]/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    Platform Status
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Integration and service health.
                  </p>
                </div>

                <ShieldCheck
                  size={21}
                  className="text-emerald-400"
                />
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* GitHub */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <GitFork size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      GitHub
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Source control integration
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 size={14} />
                  Healthy
                </div>
              </div>

              {/* Deployment */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                    <Rocket size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Deployment Engine
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      CI/CD integration
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock3 size={14} />
                  Pending
                </div>
              </div>

              {/* Monitoring */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Activity size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Observability
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Metrics and monitoring
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock3 size={14} />
                  Pending
                </div>
              </div>

              {/* Infrastructure */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <Server size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Infrastructure
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Cloud and Kubernetes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <XCircle size={14} />
                  Not connected
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 p-5 bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Zap size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Platform foundation ready
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Connect infrastructure services to unlock the
                    full platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="mt-6 bg-[#11182b]/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user?.login || "User"}
                  className="w-14 h-14 rounded-2xl border border-slate-700"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
              )}

              <div>
                <p className="text-sm text-slate-400">
                  Active Workspace Identity
                </p>

                <h3 className="text-lg font-semibold mt-1">
                  {user?.name || user?.login || "User"}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  GitHub account @{user?.login || "account"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <CheckCircle2
                size={18}
                className="text-emerald-400"
              />

              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Workspace authenticated
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  GitHub authentication session active
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;