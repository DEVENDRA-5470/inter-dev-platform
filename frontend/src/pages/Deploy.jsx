import { useEffect, useState } from "react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  GitBranch,
  GitFork,
  Loader2,
  Lock,
  Rocket,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";

const API_URL = "http://localhost:8000";

function Deploy() {
  const params = new URLSearchParams(window.location.search);

  const repositoryId = params.get("repository_id");

  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applicationName, setApplicationName] = useState("");
  const [environment, setEnvironment] = useState("development");
  const [branch, setBranch] = useState("");
  const [deploymentType, setDeploymentType] = useState("auto");

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/github/repositories`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch repository information"
          );
        }

        const data = await response.json();

        const repositories =
          data.repositories || [];

        const selectedRepository =
          repositories.find(
            (repo) =>
              String(repo.id) ===
              String(repositoryId)
          );

        if (!selectedRepository) {
          throw new Error(
            "Repository not found"
          );
        }

        setRepository(selectedRepository);

        setApplicationName(
          selectedRepository.name
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
        );

        setBranch(
          selectedRepository.default_branch ||
            "main"
        );
      } catch (err) {
        console.error(
          "Failed to load repository:",
          err
        );

        setError(
          err.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (repositoryId) {
      fetchRepository();
    } else {
      setError(
        "No repository selected"
      );

      setLoading(false);
    }
  }, [repositoryId]);

  const handleBack = () => {
    window.location.href =
      "/repositories";
  };

  const handleContinue = () => {
    if (!applicationName.trim()) {
      alert(
        "Application name is required"
      );

      return;
    }

    if (!branch.trim()) {
      alert(
        "Git branch is required"
      );

      return;
    }

    const deploymentConfig = {
      repository_id: repository.id,
      repository_name:
        repository.full_name,
      application_name:
        applicationName.trim(),
      environment,
      branch: branch.trim(),
      deployment_type:
        deploymentType,
    };

    console.log(
      "DEPLOYMENT CONFIG:",
      deploymentConfig
    );

    /*
      NEXT STEP:

      POST /applications

      Send deploymentConfig to backend.

      Backend will create the application
      and deployment configuration.
    */

    alert(
      "Deployment configuration created successfully.\n\nNext step: Create Application API."
    );
  };

  const environmentConfig = {
    development: {
      label: "Development",
      description: "Safe workspace for development",
      dot: "bg-blue-400",
      active:
        "border-blue-500 bg-blue-500/[0.08] text-blue-300",
    },

    staging: {
      label: "Staging",
      description: "Pre-production validation",
      dot: "bg-yellow-400",
      active:
        "border-yellow-500 bg-yellow-500/[0.08] text-yellow-300",
    },

    production: {
      label: "Production",
      description: "Live customer environment",
      dot: "bg-emerald-400",
      active:
        "border-emerald-500 bg-emerald-500/[0.08] text-emerald-300",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b1a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Loader2
              size={24}
              className="animate-spin text-blue-400"
            />
          </div>

          <h2 className="mt-5 text-sm font-medium">
            Preparing deployment workspace
          </h2>

          <p className="mt-2 text-xs text-slate-500">
            Loading repository configuration...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070b1a] text-white flex items-center justify-center px-5">
        <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-[#0d1426] p-7 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <Server size={22} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Unable to prepare deployment
          </h2>

          <p className="text-sm leading-6 text-slate-500 mt-3">
            {error}
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-6 w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-sm font-medium"
          >
            Back to repositories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full bg-blue-600/[0.05] blur-3xl" />

        <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] rounded-full bg-violet-600/[0.04] blur-3xl" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-[#070b1a]/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-600 transition flex items-center justify-center"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="h-7 w-px bg-slate-800" />

            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Rocket size={18} />
            </div>

            <div>
              <h1 className="text-sm font-semibold">
                Deploy Application
              </h1>

              <p className="text-[11px] text-slate-500 mt-0.5">
                Configure and launch your service
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

            Repository connected
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-6 py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/15 bg-blue-500/[0.05] text-[11px] font-medium text-blue-300">
              <Workflow size={13} />

              Deployment workflow
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              Configure your deployment
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl leading-7">
              Define application settings, select
              the deployment environment and prepare
              your repository for deployment.
            </p>
          </div>

          {/* Compact progress */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Check size={13} />
              </div>

              <span className="hidden sm:inline">
                Repository
              </span>
            </div>

            <div className="w-6 h-px bg-slate-700" />

            <div className="flex items-center gap-2 text-blue-400">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                2
              </div>

              <span className="hidden sm:inline">
                Configure
              </span>
            </div>

            <div className="w-6 h-px bg-slate-800" />

            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                3
              </div>

              <span className="hidden sm:inline">
                Deploy
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8">
          {/* MAIN FORM */}
          <div className="space-y-5">
            {/* Repository */}
            <section className="rounded-2xl border border-slate-800 bg-[#0d1426]/90 overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <GitFork size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Source repository
                    </h3>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Connected GitHub repository
                    </p>
                  </div>
                </div>

                <div
                  className={
                    repository?.private
                      ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-yellow-500/15 bg-yellow-500/[0.05] text-[10px] text-yellow-400"
                      : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] text-[10px] text-emerald-400"
                  }
                >
                  {repository?.private ? (
                    <Lock size={11} />
                  ) : (
                    <CheckCircle2 size={11} />
                  )}

                  {repository?.private
                    ? "Private"
                    : "Public"}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center">
                      <Code2 size={20} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-medium truncate">
                        {repository?.name}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {repository?.full_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <GitBranch size={14} />

                    {repository?.default_branch ||
                      "main"}
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration */}
            <section className="rounded-2xl border border-slate-800 bg-[#0d1426]/90">
              <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                  <Settings2 size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Application configuration
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Define how this application will run
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                {/* Application Name */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label className="text-sm font-medium">
                      Application name
                    </label>

                    <span className="text-[10px] text-slate-600">
                      Platform identifier
                    </span>
                  </div>

                  <input
                    type="text"
                    value={applicationName}
                    onChange={(event) =>
                      setApplicationName(
                        event.target.value
                      )
                    }
                    placeholder="my-application"
                    className="w-full h-11 bg-[#090e1f] border border-slate-800 rounded-xl px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                  />

                  <p className="mt-2 text-[11px] text-slate-600">
                    Used to identify your application
                    inside the platform.
                  </p>
                </div>

                {/* Environment */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <label className="text-sm font-medium">
                      Deployment environment
                    </label>

                    <span className="text-[10px] text-slate-600">
                      Select target
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {Object.entries(
                      environmentConfig
                    ).map(([key, config]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setEnvironment(key)
                        }
                        className={`relative text-left rounded-xl border p-4 transition ${
                          environment === key
                            ? config.active
                            : "border-slate-800 bg-[#090e1f] text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {environment === key && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2
                              size={14}
                            />
                          </div>
                        )}

                        <div
                          className={`w-2 h-2 rounded-full ${config.dot}`}
                        />

                        <p className="mt-3 text-sm font-medium">
                          {config.label}
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                          {config.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label className="text-sm font-medium">
                      Git branch
                    </label>

                    <span className="text-[10px] text-slate-600">
                      Source revision
                    </span>
                  </div>

                  <div className="relative">
                    <GitBranch
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={branch}
                      onChange={(event) =>
                        setBranch(
                          event.target.value
                        )
                      }
                      className="w-full h-11 bg-[#090e1f] border border-slate-800 rounded-xl pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>

                {/* Deployment Type */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <label className="text-sm font-medium">
                      Deployment method
                    </label>

                    <span className="text-[10px] text-slate-600">
                      Build strategy
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setDeploymentType(
                          "auto"
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        deploymentType === "auto"
                          ? "border-blue-500 bg-blue-500/[0.08]"
                          : "border-slate-800 bg-[#090e1f] hover:border-slate-700"
                      }`}
                    >
                      <Sparkles
                        size={17}
                        className={
                          deploymentType === "auto"
                            ? "text-blue-400"
                            : "text-slate-500"
                        }
                      />

                      <p className="mt-3 text-sm font-medium">
                        Auto detect
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Detect runtime automatically
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeploymentType(
                          "docker"
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        deploymentType === "docker"
                          ? "border-blue-500 bg-blue-500/[0.08]"
                          : "border-slate-800 bg-[#090e1f] hover:border-slate-700"
                      }`}
                    >
                      <Server
                        size={17}
                        className={
                          deploymentType === "docker"
                            ? "text-blue-400"
                            : "text-slate-500"
                        }
                      />

                      <p className="mt-3 text-sm font-medium">
                        Docker
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Use container deployment
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeploymentType(
                          "custom"
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        deploymentType === "custom"
                          ? "border-blue-500 bg-blue-500/[0.08]"
                          : "border-slate-800 bg-[#090e1f] hover:border-slate-700"
                      }`}
                    >
                      <Terminal
                        size={17}
                        className={
                          deploymentType === "custom"
                            ? "text-blue-400"
                            : "text-slate-500"
                        }
                      />

                      <p className="mt-3 text-sm font-medium">
                        Custom
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Configure manually
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Bar */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleBack}
                className="h-11 px-5 rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="group h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 hover:brightness-110 hover:-translate-y-px active:translate-y-0 transition-all"
              >
                Continue to deployment

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            {/* Deployment Summary */}
            <section className="rounded-2xl border border-slate-800 bg-[#0d1426]/90 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Activity size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Deployment summary
                    </h3>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Current configuration
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Environment
                  </span>

                  <span className="text-xs font-medium text-slate-300 capitalize">
                    {environment}
                  </span>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Branch
                  </span>

                  <span className="text-xs font-medium text-slate-300 truncate max-w-[150px]">
                    {branch || "Not selected"}
                  </span>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Strategy
                  </span>

                  <span className="text-xs font-medium text-slate-300 capitalize">
                    {deploymentType === "auto"
                      ? "Auto detect"
                      : deploymentType}
                  </span>
                </div>
              </div>
            </section>

            {/* Workflow */}
            <section className="rounded-2xl border border-slate-800 bg-[#0d1426]/90 p-5">
              <h3 className="text-sm font-semibold">
                Deployment flow
              </h3>

              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Check size={14} />
                  </div>

                  <div>
                    <p className="text-xs font-medium">
                      Repository selected
                    </p>

                    <p className="mt-1 text-[11px] text-slate-600">
                      Source code connected
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                    2
                  </div>

                  <div>
                    <p className="text-xs font-medium text-blue-300">
                      Configure application
                    </p>

                    <p className="mt-1 text-[11px] text-slate-600">
                      Current step
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center text-xs">
                    3
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Create application
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center text-xs">
                    4
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Build and deploy
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.025] p-5">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-emerald-300">
                    Secure deployment workflow
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    Repository access and deployment
                    configuration are processed through
                    your authenticated platform session.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Deploy;