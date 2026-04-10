import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BadgeDollarSign,
  Briefcase,
  Building2,
  CheckCircle2,
  Edit3,
  Globe,
  LogOut,
  Mail,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api, clearStoredAuth, getStoredAuth, setStoredAuth } from "./services/api";

const getValue = (source, keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== "") {
      return source[key];
    }
  }
  return null;
};

const normalizeCompanyProfile = (data) => {
  const source = data?.company || data?.data || data;

  return {
    id: getValue(source, ["id", "companyId", "userId"]),
    companyName: getValue(source, ["companyName", "name"]),
    industry: getValue(source, ["industry", "companyType"]),
    contactPerson: getValue(source, ["contactPerson", "contactName", "hrName"]),
    email: getValue(source, ["email", "companyEmail"]),
    phone: getValue(source, ["phone", "phoneNumber", "mobile"]),
    website: getValue(source, ["website", "companyWebsite"]),
    positions: getValue(source, ["positions", "numberOfPositions", "vacancies"]),
    salaryPackage: getValue(source, ["salaryPackage", "package", "packageOffered"]),
    minimumCgpa: getValue(source, ["minimumCgpa", "minCgpa"]),
    semester: getValue(source, ["semester", "sem"]),
    location: getValue(source, ["location", "jobLocation"]),
    jobDescription: getValue(source, ["jobDescription", "description", "roleDescription"]),
    role: getValue(source, ["role"]) || "COMPANY",
    status: getValue(source, ["status", "registrationStatus", "approvalStatus"]) || "PENDING",
  };
};

const getEditableCompanyForm = (company) => ({
  companyName: company?.companyName || "",
  industry: company?.industry || "",
  contactPerson: company?.contactPerson || "",
  website: company?.website || "",
});

const getEmptyJobForm = () => ({
  title: "",
  applicationLink: "",
  description: "",
  positions: "",
  salaryPackage: "",
  minimumCgpa: "",
  semester: "",
  location: "",
  jdFile: null,
});

const statusTone = {
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export function CompanyDashboardPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [profileForm, setProfileForm] = useState(getEditableCompanyForm(null));
  const [jobForm, setJobForm] = useState(getEmptyJobForm());
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [postingJob, setPostingJob] = useState(false);
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [jobMessage, setJobMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [jobFieldErrors, setJobFieldErrors] = useState({});

  useEffect(() => {
    const loadCompanyDashboard = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth) {
        navigate("/", { replace: true });
        return;
      }

      try {
        if (storedAuth?.expiresAt && Date.now() >= storedAuth.expiresAt) {
          clearStoredAuth();
          navigate("/", { replace: true });
          return;
        }

        if (storedAuth.role !== "COMPANY") {
          navigate("/", { replace: true });
          return;
        }

        const [profileResponse, jobsResponse] = await Promise.all([
          api.getCompanyProfile(),
          api.getCompanyJobs(),
        ]);

        const profileData = normalizeCompanyProfile(profileResponse);
        const nextCompany = {
          ...storedAuth,
          ...profileData,
          id: profileData.id || storedAuth.userId,
          companyName: profileData.companyName || storedAuth.companyName || storedAuth.name,
          email: profileData.email || storedAuth.email,
          role: profileData.role || storedAuth.role || "COMPANY",
        };

        setCompany(nextCompany);
        setProfileForm(getEditableCompanyForm(nextCompany));
        setJobs(Array.isArray(jobsResponse) ? jobsResponse : []);
      } catch (err: any) {
        if (err.message?.toLowerCase().includes("log in")) {
          clearStoredAuth();
          navigate("/", { replace: true });
          return;
        }
        setError(err.message || "Unable to load company dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadCompanyDashboard();
  }, [navigate]);

  const handleLogout = () => {
    api.logout().catch(() => {});
    clearStoredAuth();
    navigate("/", { replace: true });
  };

  const getInputClassName = (fieldName: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      fieldErrors[fieldName] ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
    }`;

  const getJobInputClassName = (fieldName: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      jobFieldErrors[fieldName] ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
    }`;

  const handleEditToggle = () => {
    setIsEditing(true);
    setProfileMessage("");
    setFieldErrors({});
    setProfileForm(getEditableCompanyForm(company));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileMessage("");
    setFieldErrors({});
    setProfileForm(getEditableCompanyForm(company));
  };

  const handleSaveProfile = async () => {
    const nextErrors = {
      ...(profileForm.companyName.trim() ? {} : { companyName: "Company name is required." }),
      ...(profileForm.contactPerson.trim() ? {} : { contactPerson: "Contact person is required." }),
    };

    setFieldErrors(nextErrors);
    setProfileMessage("");

    if (Object.keys(nextErrors).length > 0) {
      setProfileMessage("Please fix the highlighted profile fields.");
      return;
    }

    setSavingProfile(true);

    try {
      const payload = {
        companyName: profileForm.companyName.trim(),
        industry: profileForm.industry.trim(),
        contactPerson: profileForm.contactPerson.trim(),
        website: profileForm.website.trim(),
        positions: company?.positions || 1,
        salaryPackage: company?.salaryPackage || "Not specified",
        minimumCgpa: company?.minimumCgpa ?? null,
        semester: company?.semester || "",
        location: company?.location || "Not specified",
        jobDescription: company?.jobDescription || "Not specified",
      };

      const response = await api.updateCompanyProfile(payload);
      const updatedProfile = normalizeCompanyProfile(response);
      const mergedCompany = {
        ...company,
        ...updatedProfile,
        ...payload,
      };

      setCompany(mergedCompany);
      setProfileForm(getEditableCompanyForm(mergedCompany));
      setIsEditing(false);
      setProfileMessage("Company profile updated successfully.");

      const storedAuth = getStoredAuth();
      if (storedAuth) {
        setStoredAuth({
          ...storedAuth,
          companyName: mergedCompany.companyName,
          name: mergedCompany.companyName,
        });
      }
    } catch (err: any) {
      const nextFieldErrors = { ...(err.fieldErrors || {}) };
      if (err.field) {
        nextFieldErrors[err.field] = err.message;
      }
      setFieldErrors(nextFieldErrors);
      setProfileMessage(
        Object.keys(nextFieldErrors).length > 0
          ? "Please fix the highlighted profile fields."
          : err.message || "Unable to update company profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateJob = async () => {
    const nextErrors = {
      ...(jobForm.title.trim() ? {} : { title: "Job title is required." }),
      ...(jobForm.description.trim() ? {} : { description: "Description is required." }),
      ...(jobForm.positions && Number(jobForm.positions) > 0 ? {} : { positions: "Positions must be at least 1." }),
      ...(jobForm.salaryPackage.trim() ? {} : { salaryPackage: "Salary package is required." }),
      ...(jobForm.location.trim() ? {} : { location: "Location is required." }),
    };

    setJobFieldErrors(nextErrors);
    setJobMessage("");

    if (Object.keys(nextErrors).length > 0) {
      setJobMessage("Please fix the highlighted job fields.");
      return;
    }

    setPostingJob(true);

    try {
      if (jobForm.jdFile) {
        const isPdfType = jobForm.jdFile.type === "application/pdf";
        const hasPdfExtension = jobForm.jdFile.name.toLowerCase().endsWith(".pdf");

        if (!isPdfType && !hasPdfExtension) {
          setJobFieldErrors((prev) => ({ ...prev, jdFile: "Only PDF files are allowed." }));
          setJobMessage("Please fix the highlighted job fields.");
          setPostingJob(false);
          return;
        }

        if (jobForm.jdFile.size > 5 * 1024 * 1024) {
          setJobFieldErrors((prev) => ({ ...prev, jdFile: "JD file size must not exceed 5MB." }));
          setJobMessage("Please fix the highlighted job fields.");
          setPostingJob(false);
          return;
        }
      }

      const payload = new FormData();
      payload.append("title", jobForm.title.trim());
      payload.append("description", jobForm.description.trim());
      payload.append("positions", String(Number(jobForm.positions)));
      payload.append("salaryPackage", jobForm.salaryPackage.trim());
      payload.append("location", jobForm.location.trim());
      if (jobForm.minimumCgpa) {
        payload.append("minimumCgpa", String(Number(jobForm.minimumCgpa)));
      }
      if (jobForm.semester.trim()) {
        payload.append("semester", jobForm.semester.trim());
      }
      if (jobForm.applicationLink.trim()) {
        payload.append("applicationLink", jobForm.applicationLink.trim());
      }
      if (jobForm.jdFile) {
        payload.append("jdFile", jobForm.jdFile);
      }

      const createdJob = await api.createCompanyJob(payload);
      setJobs((prev) => [createdJob, ...prev]);
      setJobForm(getEmptyJobForm());
      setJobFieldErrors({});
      setJobMessage("Job added successfully. It is now waiting for admin approval.");
    } catch (err: any) {
      const nextFieldErrors = { ...(err.fieldErrors || {}) };
      if (err.field) {
        nextFieldErrors[err.field] = err.message;
      }
      setJobFieldErrors(nextFieldErrors);
      setJobMessage(
        Object.keys(nextFieldErrors).length > 0
          ? "Please fix the highlighted job fields."
          : err.message || "Unable to create job posting."
      );
    } finally {
      setPostingJob(false);
    }
  };

  const profileItems = [
    { label: "Company Name", value: company?.companyName, icon: Building2 },
    { label: "Industry", value: company?.industry, icon: Briefcase },
    { label: "Contact Person", value: company?.contactPerson, icon: User },
    { label: "Email", value: company?.email, icon: Mail },
    { label: "Phone", value: company?.phone, icon: Users },
    { label: "Website", value: company?.website, icon: Globe },
  ];

  const approvedJobs = jobs.filter((job) => job.status === "APPROVED").length;
  const pendingJobs = jobs.filter((job) => job.status === "PENDING").length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%),linear-gradient(135deg,#0f172a,#1d4ed8,#0f766e)] py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
                  Company Workspace
                </p>
                <h1 className="text-4xl font-bold lg:text-5xl">
                  {company?.companyName || "Company Dashboard"}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-200">
                  Add new roles for campus hiring, watch their approval status, and keep your company
                  details up to date.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="-mt-8 pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                Loading company dashboard...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Company Status
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                      <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusTone[company?.status] || statusTone.PENDING}`}>
                        {company?.status || "PENDING"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Total Posted Jobs
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <Briefcase className="h-8 w-8 text-accent" />
                      <span className="text-3xl font-bold text-slate-900">{jobs.length}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Approved / Pending
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      <span className="text-3xl font-bold text-slate-900">
                        {approvedJobs} / {pendingJobs}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Company Profile</h2>
                        <p className="mt-2 text-sm text-slate-500">
                          Keep the company profile clean so students and the placement cell see the
                          right contact information.
                        </p>
                      </div>

                      {!isEditing ? (
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            <Save className="h-4 w-4" />
                            {savingProfile ? "Saving..." : "Save"}
                          </button>
                        </div>
                      )}
                    </div>

                    {profileMessage && (
                      <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                        profileMessage.toLowerCase().includes("success")
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}>
                        {profileMessage}
                      </div>
                    )}

                    {!isEditing ? (
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {profileItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {item.label}
                              </p>
                              <p className="flex items-center gap-2 text-sm text-slate-700">
                                <Icon className="h-4 w-4 text-slate-400" />
                                {item.value || "Not available"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {[
                          ["companyName", "Company Name"],
                          ["industry", "Industry"],
                          ["contactPerson", "Contact Person"],
                          ["website", "Website"],
                        ].map(([field, label]) => (
                          <div key={field} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                              {label}
                            </label>
                            <input
                              type="text"
                              value={profileForm[field]}
                              onChange={(e) => {
                                setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
                                setFieldErrors((prev) => ({ ...prev, [field]: "" }));
                              }}
                              className={getInputClassName(field)}
                            />
                            {fieldErrors[field] && (
                              <p className="mt-1 text-sm text-red-600">{fieldErrors[field]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-900">Add New Job</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Every new job goes to the admin panel for approval before students can see it.
                    </p>

                    {jobMessage && (
                      <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                        jobMessage.toLowerCase().includes("success") || jobMessage.toLowerCase().includes("waiting")
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}>
                        {jobMessage}
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={jobForm.title}
                          onChange={(e) => {
                            setJobForm((prev) => ({ ...prev, title: e.target.value }));
                            setJobFieldErrors((prev) => ({ ...prev, title: "" }));
                          }}
                          className={getJobInputClassName("title")}
                          placeholder="Graduate Software Engineer"
                        />
                        {jobFieldErrors.title && <p className="mt-1 text-sm text-red-600">{jobFieldErrors.title}</p>}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Positions
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={jobForm.positions}
                            onChange={(e) => {
                              setJobForm((prev) => ({ ...prev, positions: e.target.value }));
                              setJobFieldErrors((prev) => ({ ...prev, positions: "" }));
                            }}
                            className={getJobInputClassName("positions")}
                            placeholder="5"
                          />
                          {jobFieldErrors.positions && <p className="mt-1 text-sm text-red-600">{jobFieldErrors.positions}</p>}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Package
                          </label>
                          <input
                            type="text"
                            value={jobForm.salaryPackage}
                            onChange={(e) => {
                              setJobForm((prev) => ({ ...prev, salaryPackage: e.target.value }));
                              setJobFieldErrors((prev) => ({ ...prev, salaryPackage: "" }));
                            }}
                            className={getJobInputClassName("salaryPackage")}
                            placeholder="8-12 LPA"
                          />
                          {jobFieldErrors.salaryPackage && <p className="mt-1 text-sm text-red-600">{jobFieldErrors.salaryPackage}</p>}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Application Link
                          </label>
                          <input
                            type="url"
                            value={jobForm.applicationLink}
                            onChange={(e) => {
                              setJobForm((prev) => ({ ...prev, applicationLink: e.target.value }));
                              setJobFieldErrors((prev) => ({ ...prev, applicationLink: "" }));
                            }}
                            className={getJobInputClassName("applicationLink")}
                            placeholder="https://company.com/careers/apply"
                          />
                          {jobFieldErrors.applicationLink && <p className="mt-1 text-sm text-red-600">{jobFieldErrors.applicationLink}</p>}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Minimum CGPA
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={jobForm.minimumCgpa}
                            onChange={(e) => {
                              setJobForm((prev) => ({ ...prev, minimumCgpa: e.target.value }));
                              setJobFieldErrors((prev) => ({ ...prev, minimumCgpa: "" }));
                            }}
                            className={getJobInputClassName("minimumCgpa")}
                            placeholder="6.5"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Semester
                          </label>
                          <input
                            type="text"
                            value={jobForm.semester}
                            onChange={(e) => setJobForm((prev) => ({ ...prev, semester: e.target.value }))}
                            className={getJobInputClassName("semester")}
                            placeholder="Final Semester"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Location
                        </label>
                        <input
                          type="text"
                          value={jobForm.location}
                          onChange={(e) => {
                            setJobForm((prev) => ({ ...prev, location: e.target.value }));
                            setJobFieldErrors((prev) => ({ ...prev, location: "" }));
                          }}
                          className={getJobInputClassName("location")}
                          placeholder="Bengaluru / Hyderabad"
                        />
                        {jobFieldErrors.location && <p className="mt-1 text-sm text-red-600">{jobFieldErrors.location}</p>}
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          JD PDF
                        </label>
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={(e) => {
                            setJobForm((prev) => ({ ...prev, jdFile: e.target.files?.[0] || null }));
                            setJobFieldErrors((prev) => ({ ...prev, jdFile: "" }));
                          }}
                          className={getJobInputClassName("jdFile")}
                        />
                        <p className="mt-1 text-xs text-slate-500">Optional. PDF only, up to 5MB.</p>
                        {jobFieldErrors.jdFile && <p className="mt-1 text-sm text-red-600">{jobFieldErrors.jdFile}</p>}
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Description
                        </label>
                        <textarea
                          rows={5}
                          value={jobForm.description}
                          onChange={(e) => {
                            setJobForm((prev) => ({ ...prev, description: e.target.value }));
                            setJobFieldErrors((prev) => ({ ...prev, description: "" }));
                          }}
                          className={getJobInputClassName("description")}
                          placeholder="Responsibilities, hiring process, and required skills..."
                        />
                        {jobFieldErrors.description && <p className="mt-1 text-sm text-red-600">{jobFieldErrors.description}</p>}
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateJob}
                        disabled={postingJob}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
                      >
                        <Plus className="h-4 w-4" />
                        {postingJob ? "Posting..." : "Add Job For Approval"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">Posted Jobs</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Students will only see jobs after both the company and the job are approved.
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      {jobs.length} total jobs
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {jobs.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                        No jobs posted yet. Add the first role from the panel above.
                      </div>
                    ) : (
                      jobs.map((job) => (
                        <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                              <p className="mt-1 text-sm text-slate-500">{job.location}</p>
                            </div>
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[job.status] || statusTone.PENDING}`}>
                              {job.status}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-slate-400" />
                              {job.positions} openings
                            </div>
                            <div className="flex items-center gap-2">
                              <BadgeDollarSign className="h-4 w-4 text-slate-400" />
                              {job.salaryPackage}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {job.location}
                            </div>
                            {job.applicationLink && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-slate-400" />
                                <a
                                  href={job.applicationLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Apply Link
                                </a>
                              </div>
                            )}
                            {job.minimumCgpa !== null && job.minimumCgpa !== undefined && (
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-slate-400" />
                                Minimum CGPA: {job.minimumCgpa}
                              </div>
                            )}
                          </div>

                          <p className="mt-4 text-sm leading-6 text-slate-700">{job.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
