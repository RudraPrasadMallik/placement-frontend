import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  ChevronDown,
  ExternalLink,
  Globe,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api, getStoredAuth } from "./services/api";

export function JobsPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openJobIds, setOpenJobIds] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [applyingJobId, setApplyingJobId] = useState(null);

  const auth = getStoredAuth();
  const isStudentLoggedIn = auth?.role === "STUDENT";

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const [jobsResponse, appliedJobsResponse] = await Promise.all([
          api.getPublicCompanyJobs(),
          isStudentLoggedIn ? api.getStudentAppliedJobs().catch(() => []) : Promise.resolve([]),
        ]);
        setCompanies(Array.isArray(jobsResponse) ? jobsResponse : []);
        setAppliedJobIds(
          Array.isArray(appliedJobsResponse)
            ? appliedJobsResponse.map((item) => item.jobId).filter(Boolean)
            : []
        );
      } catch (err: any) {
        setError(err.message || "Unable to load jobs right now.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [isStudentLoggedIn]);

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return companies;
    }

    return companies.filter((company) => {
      const matchesCompany =
        company.companyName?.toLowerCase().includes(normalizedSearch) ||
        company.industry?.toLowerCase().includes(normalizedSearch) ||
        company.location?.toLowerCase().includes(normalizedSearch);

      const matchesJob = (company.jobs || []).some(
        (job) =>
          job.title?.toLowerCase().includes(normalizedSearch) ||
          job.description?.toLowerCase().includes(normalizedSearch)
      );

      return matchesCompany || matchesJob;
    });
  }, [companies, searchTerm]);

  const openCompanyModal = (company) => {
    setSelectedCompany(company);
    setOpenJobIds([]);
  };

  const closeCompanyModal = () => {
    setSelectedCompany(null);
    setOpenJobIds([]);
  };

  const toggleJob = (jobId) => {
    setOpenJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleMarkApplied = async (jobId) => {
    if (!isStudentLoggedIn || appliedJobIds.includes(jobId)) {
      return;
    }

    try {
      setApplyingJobId(jobId);
      setActionMessage("");
      await api.applyForJob(jobId);
      setAppliedJobIds((prev) => [...prev, jobId]);
      setActionMessage("Job added to your student dashboard.");
    } catch (err: any) {
      setActionMessage(err.message || "Unable to mark this job as applied.");
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_28%),linear-gradient(135deg,#0f172a,#1d4ed8,#164e63)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
              Approved Campus Openings
            </p>
            <h1 className="mt-3 text-4xl font-bold lg:text-5xl">Jobs</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">
              Browse approved companies as cards. Open any company to view available roles and expand
              each job title to reveal the apply link.
            </p>
          </div>
        </section>

        <section className="-mt-8 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search companies, industries, locations, or job titles..."
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {loading && (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
                Loading approved jobs...
              </div>
            )}

            {!loading && error && (
              <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="mt-8">
                {actionMessage && (
                  <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm">
                    {actionMessage}
                  </div>
                )}

                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-slate-900">Companies</h2>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                    {filteredCompanies.length} companies
                  </span>
                </div>

                {filteredCompanies.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                    No companies matched your search.
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredCompanies.map((company) => (
                      <button
                        key={company.companyId}
                        type="button"
                        onClick={() => openCompanyModal(company)}
                        className="group rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {(company.jobs || []).length} jobs
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                          {company.companyName}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {company.industry || "Industry not specified"}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {company.location || "Location TBD"}
                          </span>
                          {company.contactPerson && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2">
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              {company.contactPerson}
                            </span>
                          )}
                        </div>

                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
                          View Jobs
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#eff6ff,#f8fafc)] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    {selectedCompany.industry || "Campus Recruitment"}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {selectedCompany.companyName}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                      <Briefcase className="h-4 w-4 text-slate-500" />
                      {(selectedCompany.jobs || []).length} job titles
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {selectedCompany.location || "Location not specified"}
                    </span>
                    {selectedCompany.website && (
                      <a
                        href={selectedCompany.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                      >
                        <Globe className="h-4 w-4 text-slate-500" />
                        Website
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCompanyModal}
                  className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6">
              <div className="space-y-4">
                {(selectedCompany.jobs || []).map((job) => {
                  const isOpen = openJobIds.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                    >
                      <button
                        type="button"
                        onClick={() => toggleJob(job.id)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-white"
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                          <p className="mt-2 text-sm text-slate-500">
                            Click to {isOpen ? "hide" : "view"} apply details
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-200 bg-white px-5 py-5">
                          <p className="text-sm leading-7 text-slate-600">{job.description}</p>

                          <div className="mt-5 grid gap-3 md:grid-cols-3">
                            <InfoPill label="Openings" value={String(job.positions)} />
                            <InfoPill label="Package" value={job.salaryPackage} />
                            <InfoPill
                              label="Location"
                              value={job.location || selectedCompany.location || "Not specified"}
                            />
                          </div>

                          <div className="mt-5 flex flex-wrap gap-3">
                            {job.applicationLink ? (
                              <a
                                href={job.applicationLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Apply Link
                              </a>
                            ) : (
                              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
                                Apply link not available
                              </div>
                            )}

                            {isStudentLoggedIn && (
                              <button
                                type="button"
                                onClick={() => handleMarkApplied(job.id)}
                                disabled={appliedJobIds.includes(job.id) || applyingJobId === job.id}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                  appliedJobIds.includes(job.id)
                                    ? "cursor-not-allowed border border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {appliedJobIds.includes(job.id)
                                  ? "Applied"
                                  : applyingJobId === job.id
                                    ? "Saving..."
                                    : "Mark Applied"}
                              </button>
                            )}

                            {job.jdFileUrl && (
                              <a
                                href={`http://localhost:8080/${job.jdFileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                <Briefcase className="h-4 w-4" />
                                View JD
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
