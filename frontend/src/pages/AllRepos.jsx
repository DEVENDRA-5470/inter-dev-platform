import { useEffect, useState } from "react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Code2,
  ExternalLink,
  GitFork,
  GitBranch,
  Lock,
  Monitor,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Unlock,
  X,
} from "lucide-react";

const API_URL = "http://localhost:8000";

function AllRepos() {
  const [repositories, setRepositories] = useState([]);
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchRepositories = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to fetch repositories"
        );
      }

      const data = await response.json();

      const repos = data.repositories || [];

      setRepositories(repos);
      setFilteredRepositories(repos);
    } catch (error) {
      console.error(
        "Failed to fetch repositories:",
        error
      );

      setError(
        error.message ||
          "Unable to load repositories"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setFilteredRepositories(repositories);
      return;
    }

    const filtered = repositories.filter((repo) => {
      return (
        repo.name
          ?.toLowerCase()
          .includes(query) ||
        repo.full_name
          ?.toLowerCase()
          .includes(query) ||
        repo.description
          ?.toLowerCase()
          .includes(query) ||
        repo.language
          ?.toLowerCase()
          .includes(query)
      );
    });

    setFilteredRepositories(filtered);
  }, [search, repositories]);

  const handleBackToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const handleOpenRepository = (repo) => {
    if (!repo.html_url) return;

    window.open(
      repo.html_url,
      "_blank",
      "noopener,noreferrer"
    );
  };

const handleDeploy = (repository) => {
  window.location.href =
    `/deploy?repository_id=${repository.id}`;
};

  const handleMonitor = (repo) => {
    const repository = encodeURIComponent(
      repo.full_name || repo.name
    );

    window.location.href =
      `/monitoring?repository=${repository}`;
  };

  const clearSearch = () => {
    setSearch("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b1a] text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-800 animate-pulse" />

              <div className="space-y-2">
                <div className="w-48 h-5 rounded bg-slate-800 animate-pulse" />
                <div className="w-32 h-3 rounded bg-slate-800 animate-pulse" />
              </div>
            </div>

            <div className="w-24 h-9 rounded-lg bg-slate-800 animate-pulse" />
          </div>

          <div className="h-12 rounded-xl bg-slate-800 animate-pulse mb-6" />

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-28 rounded-xl bg-[#11182b] border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070b1a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#10182c] border border-red-500/20 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-5">
            <GitFork size={22} />
          </div>

          <h1 className="text-lg font-semibold">
            Unable to load repositories
          </h1>

          <p className="text-sm text-slate-400 mt-2 leading-6">
            {error}
          </p>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-sm hover:bg-slate-800 transition"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => fetchRepositories()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-medium transition"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[650px] h-[650px] rounded-full bg-blue-600/[0.07] blur-3xl" />

        <div className="absolute -bottom-48 -right-48 w-[650px] h-[650px] rounded-full bg-violet-600/[0.07] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-7">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="mt-0.5 w-10 h-10 rounded-xl border border-slate-800 bg-[#10182c]/80 text-slate-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/10 flex items-center justify-center transition"
              title="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/10 text-blue-400 flex items-center justify-center">
                  <GitFork size={21} />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Repositories
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Source code connected to your workspace
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15 text-xs text-emerald-400">
              <ShieldCheck size={15} />
              GitHub connected
            </div>

            <button
              type="button"
              onClick={() => fetchRepositories(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-[#10182c]/80 hover:bg-slate-800 hover:border-slate-600 text-sm transition disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </header>

        {/* Search + Stats */}
        <section className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
          <div className="relative flex-1 max-w-2xl">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search repositories, language or description..."
              className="w-full h-11 pl-11 pr-11 rounded-xl bg-[#10182c]/80 border border-slate-800 outline-none text-sm text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/[0.05] transition"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-lg border border-slate-800 bg-[#10182c]/70">
              <span className="text-xs text-slate-500">
                Total
              </span>

              <span className="ml-2 text-sm font-semibold">
                {repositories.length}
              </span>
            </div>

            {search && (
              <div className="px-3 py-2 rounded-lg border border-blue-500/20 bg-blue-500/[0.05]">
                <span className="text-xs text-slate-500">
                  Results
                </span>

                <span className="ml-2 text-sm font-semibold text-blue-400">
                  {filteredRepositories.length}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Table Header */}
        {repositories.length > 0 && (
          <div className="hidden lg:grid grid-cols-[minmax(0,1.8fr)_140px_120px_320px] gap-4 px-5 py-3 text-[11px] uppercase tracking-wider text-slate-600">
            <div>Repository</div>
            <div>Access</div>
            <div>Language</div>
            <div className="text-right">
              Actions
            </div>
          </div>
        )}

        {/* Empty State */}
        {repositories.length === 0 && (
          <div className="border border-slate-800 bg-[#10182c]/70 rounded-2xl py-20 px-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mb-5">
              <GitFork size={24} />
            </div>

            <h2 className="text-lg font-semibold">
              No repositories found
            </h2>

            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              No GitHub repositories are currently
              available for this account.
            </p>

            <button
              type="button"
              onClick={() => fetchRepositories(true)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium transition"
            >
              <RefreshCw size={16} />
              Refresh repositories
            </button>
          </div>
        )}

        {/* No Search Results */}
        {repositories.length > 0 &&
          filteredRepositories.length === 0 && (
            <div className="border border-slate-800 bg-[#10182c]/70 rounded-2xl py-16 px-6 text-center">
              <Search
                size={28}
                className="mx-auto text-slate-600 mb-4"
              />

              <h2 className="text-base font-semibold">
                No matching repositories
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Try another repository name, language or
                keyword.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Clear search
              </button>
            </div>
          )}

        {/* Repository List */}
        {filteredRepositories.length > 0 && (
          <section className="space-y-3">
            {filteredRepositories.map((repo) => (
              <article
                key={repo.id}
                className="group relative bg-[#0d1426]/85 border border-slate-800 rounded-xl px-4 py-4 lg:px-5 hover:border-blue-500/30 hover:bg-[#10182c] transition-all duration-200"
              >
                <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1.8fr)_140px_120px_320px] lg:items-center gap-4">
                  {/* Repository */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/[0.08] border border-blue-500/[0.08] text-blue-400 flex items-center justify-center">
                      <Code2 size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold truncate">
                          {repo.name}
                        </h2>

                        {repo.private ? (
                          <Lock
                            size={13}
                            className="text-yellow-400 shrink-0"
                          />
                        ) : (
                          <Unlock
                            size={13}
                            className="text-emerald-400 shrink-0"
                          />
                        )}
                      </div>

                      <p className="text-xs text-slate-500 truncate mt-1">
                        {repo.full_name}
                      </p>

                      {repo.description && (
                        <p className="hidden sm:block text-xs text-slate-600 truncate mt-1.5 max-w-xl">
                          {repo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Access */}
                  <div className="flex lg:block items-center justify-between gap-3">
                    <span className="lg:hidden text-xs text-slate-600">
                      Access
                    </span>

                    {repo.private ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-yellow-500/[0.07] text-yellow-400 border border-yellow-500/15">
                        <Lock size={12} />
                        Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/[0.07] text-emerald-400 border border-emerald-500/15">
                        <Unlock size={12} />
                        Public
                      </span>
                    )}
                  </div>

                  {/* Language */}
                  <div className="flex lg:block items-center justify-between gap-3">
                    <span className="lg:hidden text-xs text-slate-600">
                      Technology
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />

                      <span className="text-xs text-slate-400">
                        {repo.language || "Unknown"}
                      </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-600 mt-1.5">
                      <GitBranch size={12} />
                      {repo.default_branch || "main"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center lg:justify-end gap-2 pt-2 lg:pt-0 border-t border-slate-800/70 lg:border-0">
                    {/* Deploy */}
                    <button
  type="button"
  onClick={() => handleDeploy(repo)}
  className="group/btn inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-violet-500/[0.08] text-violet-400 border border-violet-500/20 hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-all"
>
  <Rocket
    size={14}
    className="group-hover/btn:-translate-y-0.5 transition-transform"
  />

  Deploy
</button>

                    {/* Monitor */}
                    <button
                      type="button"
                      onClick={() =>
                        handleMonitor(repo)
                      }
                      className="group/btn inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/[0.07] text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                    >
                      <Activity size={14} />
                      Monitor
                    </button>

                    {/* Open */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenRepository(repo)
                      }
                      className="group/btn inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 shadow-sm shadow-blue-500/10 transition-all"
                    >
                      Open
                      <ExternalLink
                        size={13}
                        className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Footer Info */}
        {filteredRepositories.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-5 border-t border-slate-800">
            <p className="text-xs text-slate-600">
              Showing{" "}
              <span className="text-slate-400">
                {filteredRepositories.length}
              </span>{" "}
              of{" "}
              <span className="text-slate-400">
                {repositories.length}
              </span>{" "}
              repositories
            </p>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <GitFork size={13} />
              Repository data synced from GitHub
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllRepos;