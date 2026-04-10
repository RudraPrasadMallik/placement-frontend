import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  GraduationCap,
  LogOut,
  Mail,
  Plus,
  Phone,
  Trash2,
  Save,
  ShieldCheck,
  Upload,
  User,
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

const formatYear = (value) => {
  if (!value) return null;
  return String(value);
};

const normalizeStudentProfile = (data) => {
  const source = data?.student || data?.data || data;

  return {
    id: getValue(source, ["id", "studentId", "userId"]),
    fullName: getValue(source, ["fullName", "name", "studentName"]),
    email: getValue(source, ["email", "studentEmail"]),
    phone: getValue(source, ["phone", "phoneNumber", "mobile"]),
    rollNumber: getValue(source, ["rollNumber", "rollNo", "registrationNumber"]),
    department: getValue(source, ["department", "branch", "course"]),
    year: formatYear(getValue(source, ["year", "studyYear"])),
    cgpa: getValue(source, ["cgpa", "gpa"]),
    role: getValue(source, ["role"]) || "STUDENT",
    placementStatus: getValue(source, ["placementStatus", "status"]),
    resumeName: getValue(source, ["resumeName", "resumeFileName", "resume"]),
    resumeUrl: getValue(source, ["resumeUrl", "resumePath", "resumeDownloadUrl"]),
  };
};

const getEditableStudentForm = (student) => ({
  fullName: student?.fullName || "",
  department: student?.department || "",
  year: student?.year ? String(student.year) : "",
  cgpa: student?.cgpa ? String(student.cgpa) : "",
});

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    year: "",
    cgpa: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resumeActionError, setResumeActionError] = useState("");
  const [resumeActionSuccess, setResumeActionSuccess] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeDeleting, setResumeDeleting] = useState(false);
  const [semesterRecords, setSemesterRecords] = useState([]);
  const [semesterForm, setSemesterForm] = useState({
    semesterName: "",
    percentage: "",
    marksheet: null as File | null,
  });
  const [semesterError, setSemesterError] = useState("");
  const [semesterSuccess, setSemesterSuccess] = useState("");
  const [semesterSaving, setSemesterSaving] = useState(false);
  const [semesterDeletingId, setSemesterDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const loadStudentProfile = async () => {
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
        const [profileResponse, appliedJobsResponse, semesterResponse] = await Promise.all([
          api.getStudentProfile(),
          api.getStudentAppliedJobs().catch(() => []),
          api.getStudentSemesterRecords().catch(() => []),
        ]);
        const profileData = normalizeStudentProfile(profileResponse);
        const nextStudent = {
          ...storedAuth,
          ...profileData,
          id: profileData.id || storedAuth.userId,
          fullName: profileData.fullName || storedAuth.fullName || storedAuth.name,
          email: profileData.email || storedAuth.email,
          role: profileData.role || storedAuth.role || "STUDENT",
        };

        setStudent(nextStudent);
        setFormData(getEditableStudentForm(nextStudent));
        setAppliedJobs(Array.isArray(appliedJobsResponse) ? appliedJobsResponse : []);
        setSemesterRecords(Array.isArray(semesterResponse) ? semesterResponse : []);
      } catch (err: any) {
        if (err.message?.toLowerCase().includes("log in")) {
          clearStoredAuth();
          navigate("/", { replace: true });
          return;
        }
        setError(err.message || "Unable to load student profile.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentProfile();
  }, [navigate]);

  const handleLogout = () => {
    api.logout().catch(() => {});
    clearStoredAuth();
    navigate("/", { replace: true });
  };

  const getInputClassName = (fieldName: string) =>
    `w-full rounded-lg border px-4 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      fieldErrors[fieldName] ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
    }`;

  const handleEditToggle = () => {
    setIsEditing(true);
    setSaveError("");
    setSaveSuccess("");
    setResumeActionError("");
    setResumeActionSuccess("");
    setFieldErrors({});
    setFormData(getEditableStudentForm(student));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError("");
    setSaveSuccess("");
    setResumeActionError("");
    setResumeActionSuccess("");
    setFieldErrors({});
    setFormData(getEditableStudentForm(student));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    setResumeActionError("");
    setResumeActionSuccess("");
    setFieldErrors({});

    if (!formData.fullName.trim()) {
      setFieldErrors({ fullName: "Full name is required." });
      setSaveError("Please fix the highlighted fields.");
      setSaving(false);
      return;
    }

    const cgpaValue = Number(formData.cgpa);
    if (!formData.cgpa || Number.isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      setFieldErrors({ cgpa: "CGPA must be between 0 and 10." });
      setSaveError("Please fix the highlighted fields.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        department: formData.department.trim(),
        year: formData.year,
        cgpa: formData.cgpa,
      };

      const response = await api.updateStudentProfile(payload);
      const updatedProfile = normalizeStudentProfile(response);
      const mergedStudent = {
        ...student,
        ...updatedProfile,
        ...payload,
        year: formatYear(updatedProfile.year || payload.year),
      };

      setStudent(mergedStudent);
      setFormData(getEditableStudentForm(mergedStudent));
      setIsEditing(false);
      setSaveSuccess("Student profile updated successfully.");

      const storedAuth = getStoredAuth();
      if (storedAuth) {
        setStoredAuth({
          ...storedAuth,
          fullName: mergedStudent.fullName,
          name: mergedStudent.fullName,
        });
      }
    } catch (err: any) {
      const nextFieldErrors = { ...(err.fieldErrors || {}) };
      if (err.field) {
        nextFieldErrors[err.field] = err.message;
      }
      setFieldErrors(nextFieldErrors);
      setSaveError(
        Object.keys(nextFieldErrors).length > 0
          ? "Please fix the highlighted fields."
          : err.message || "Unable to update student profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setResumeActionError("");
    setResumeActionSuccess("");

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setResumeActionError("Only PDF files are allowed for resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeActionError("Resume file size must not exceed 5MB.");
      return;
    }

    try {
      setResumeUploading(true);
      const response = await api.updateStudentResume(file);
      const updatedProfile = normalizeStudentProfile(response);
      setStudent((prev) => ({
        ...prev,
        ...updatedProfile,
      }));
      setResumeActionSuccess(student?.resumeUrl ? "Resume updated successfully." : "Resume uploaded successfully.");
    } catch (err: any) {
      setResumeActionError(err.message || "Unable to update resume.");
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    setResumeActionError("");
    setResumeActionSuccess("");

    try {
      setResumeDeleting(true);
      const response = await api.deleteStudentResume();
      const updatedProfile = normalizeStudentProfile(response);
      setStudent((prev) => ({
        ...prev,
        ...updatedProfile,
      }));
      setResumeActionSuccess("Resume deleted successfully.");
    } catch (err: any) {
      setResumeActionError(err.message || "Unable to delete resume.");
    } finally {
      setResumeDeleting(false);
    }
  };

  const handleSemesterFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSemesterForm((prev) => ({ ...prev, marksheet: file }));
  };

  const handleAddSemesterRecord = async () => {
    setSemesterError("");
    setSemesterSuccess("");

    const trimmedSemesterName = semesterForm.semesterName.trim();
    const trimmedPercentage = semesterForm.percentage.trim();

    if (!trimmedSemesterName) {
      setSemesterError("Semester name is required to add a semester row.");
      return;
    }

    if (
      trimmedPercentage &&
      (Number.isNaN(Number(trimmedPercentage)) ||
        Number(trimmedPercentage) < 0 ||
        Number(trimmedPercentage) > 100)
    ) {
      setSemesterError("Semester percentage must be between 0 and 100.");
      return;
    }

    if (semesterForm.marksheet) {
      if (
        semesterForm.marksheet.type !== "application/pdf" &&
        !semesterForm.marksheet.name.toLowerCase().endsWith(".pdf")
      ) {
        setSemesterError("Only PDF files are allowed for marksheet.");
        return;
      }

      if (semesterForm.marksheet.size > 5 * 1024 * 1024) {
        setSemesterError("Marksheet file size must not exceed 5MB.");
        return;
      }
    }

    try {
      setSemesterSaving(true);
      const created = await api.createStudentSemesterRecord({
        semesterName: trimmedSemesterName,
        percentage: trimmedPercentage ? Number(trimmedPercentage) : "",
        marksheet: semesterForm.marksheet,
      });

      setSemesterRecords((prev) => [...prev, created]);
      setSemesterForm({
        semesterName: "",
        percentage: "",
        marksheet: null,
      });
      setSemesterSuccess("Semester record added successfully.");
    } catch (err: any) {
      setSemesterError(err.message || "Unable to add semester record.");
    } finally {
      setSemesterSaving(false);
    }
  };

  const handleDeleteSemesterRecord = async (recordId) => {
    setSemesterError("");
    setSemesterSuccess("");

    try {
      setSemesterDeletingId(recordId);
      await api.deleteStudentSemesterRecord(recordId);
      setSemesterRecords((prev) => prev.filter((record) => record.id !== recordId));
      setSemesterSuccess("Semester record deleted successfully.");
    } catch (err: any) {
      setSemesterError(err.message || "Unable to delete semester record.");
    } finally {
      setSemesterDeletingId(null);
    }
  };

  const profileItems = [
    { label: "Student ID", value: student?.id, icon: User },
    { label: "Full Name", value: student?.fullName, icon: User },
    { label: "Email", value: student?.email, icon: Mail },
    { label: "Phone", value: student?.phone, icon: Phone },
    { label: "Roll Number", value: student?.rollNumber, icon: GraduationCap },
    { label: "Department", value: student?.department, icon: Briefcase },
    { label: "Year", value: student?.year, icon: ShieldCheck },
    { label: "CGPA", value: student?.cgpa, icon: ShieldCheck },
    { label: "Placement Status", value: student?.placementStatus, icon: Briefcase },
    { label: "Role", value: student?.role, icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-slate-800 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
                  Student Dashboard
                </p>
                <h1 className="text-4xl font-bold lg:text-5xl">
                  Welcome{student?.fullName ? `, ${student.fullName}` : ""}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-200">
                  Track your placement journey, keep your profile ready, and stay updated on
                  upcoming opportunities.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                Loading student profile...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900">Profile Overview</h2>
                    </div>

                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit Details
                      </button>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save className="h-4 w-4" />
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>

                  {saveSuccess && (
                    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                      {saveSuccess}
                    </div>
                  )}

                  {saveError && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {saveError}
                    </div>
                  )}

                  {!isEditing ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {profileItems.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.label}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                          >
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
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                            setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                          }}
                          className={getInputClassName("fullName")}
                        />
                        {fieldErrors.fullName && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Email
                        </label>
                        <input
                          type="email"
                          value={student?.email || ""}
                          disabled
                          className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">Email cannot be edited.</p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={student?.phone || ""}
                          disabled
                          className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">Phone number cannot be edited.</p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          value={student?.rollNumber || ""}
                          disabled
                          className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">Roll number cannot be edited.</p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Department
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, department: e.target.value }));
                            setFieldErrors((prev) => ({ ...prev, department: "" }));
                          }}
                          className={getInputClassName("department")}
                        >
                          <option value="">Select Department</option>
                          <option value="CSE">Computer Science</option>
                          <option value="ECE">Electronics & Communication</option>
                          <option value="EEE">Electrical Engineering</option>
                          <option value="ME">Mechanical Engineering</option>
                          <option value="CE">Civil Engineering</option>
                        </select>
                        {fieldErrors.department && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.department}</p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Year
                        </label>
                        <input
                          type="text"
                          value={formData.year}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, year: e.target.value }));
                            setFieldErrors((prev) => ({ ...prev, year: "" }));
                          }}
                          className={getInputClassName("year")}
                          placeholder="Enter year"
                        />
                        {fieldErrors.year && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.year}</p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          CGPA
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={formData.cgpa}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, cgpa: e.target.value }));
                            setFieldErrors((prev) => ({ ...prev, cgpa: "" }));
                          }}
                          className={getInputClassName("cgpa")}
                        />
                        {fieldErrors.cgpa && (
                          <p className="mt-1 text-sm text-red-600">{fieldErrors.cgpa}</p>
                        )}
                      </div>

                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-4 inline-flex rounded-xl bg-secondary/10 p-3 text-secondary">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900">Semesters</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Add semester-wise academic records here. These are optional and kept separate from your main profile.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      {semesterRecords.length} semester{semesterRecords.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {semesterSuccess && (
                    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                      {semesterSuccess}
                    </div>
                  )}

                  {semesterError && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {semesterError}
                    </div>
                  )}

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_1fr_auto]">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Semester Name
                        </label>
                        <input
                          type="text"
                          value={semesterForm.semesterName}
                          onChange={(e) =>
                            setSemesterForm((prev) => ({ ...prev, semesterName: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Semester 1 / Trimester 2 / Sem 6"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Percentage
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={semesterForm.percentage}
                          onChange={(e) =>
                            setSemesterForm((prev) => ({ ...prev, percentage: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="82.5"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Marksheet
                        </label>
                        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100">
                          <span className="truncate">
                            {semesterForm.marksheet ? semesterForm.marksheet.name : "Upload PDF"}
                          </span>
                          <Upload className="h-4 w-4 shrink-0" />
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={handleSemesterFileChange}
                          />
                        </label>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddSemesterRecord}
                          disabled={semesterSaving}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Plus className="h-4 w-4" />
                          {semesterSaving ? "Adding..." : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {semesterRecords.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                        No semester records added yet.
                      </div>
                    ) : (
                      semesterRecords.map((record) => (
                        <div
                          key={record.id}
                          className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.2fr_0.8fr_1fr_auto]"
                        >
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Semester Name</p>
                            <p className="mt-2 text-sm font-medium text-slate-900">{record.semesterName}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Percentage</p>
                            <p className="mt-2 text-sm text-slate-800">
                              {record.percentage !== null && record.percentage !== undefined
                                ? `${record.percentage}%`
                                : "Not added"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Marksheet</p>
                            {record.marksheetUrl ? (
                              <a
                                href={record.marksheetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex text-sm font-semibold text-primary hover:text-primary/80"
                              >
                                {record.marksheetName || "View PDF"}
                              </a>
                            ) : (
                              <p className="mt-2 text-sm text-slate-500">Not uploaded</p>
                            )}
                          </div>
                          <div className="flex items-start justify-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteSemesterRecord(record.id)}
                              disabled={semesterDeletingId === record.id}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 className="h-4 w-4" />
                              {semesterDeletingId === record.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Resume</h2>
                  {resumeActionSuccess && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                      {resumeActionSuccess}
                    </div>
                  )}
                  {resumeActionError && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {resumeActionError}
                    </div>
                  )}
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">
                      {student?.resumeName || "Resume not available"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {student?.resumeUrl
                        ? "Your resume is available from the database."
                        : "Resume download URL was not provided by the backend."}
                    </p>
                    {student?.resumeUrl && (
                      <a
                        href={student.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                      >
                        <Download className="h-4 w-4" />
                        Download Resume
                      </a>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">
                        <Upload className="h-4 w-4" />
                        {resumeUploading
                          ? "Uploading..."
                          : student?.resumeUrl
                            ? "Replace Resume"
                            : "Upload Resume"}
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          disabled={resumeUploading || resumeDeleting}
                          onChange={handleResumeUpload}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleResumeDelete}
                        disabled={!student?.resumeUrl || resumeUploading || resumeDeleting}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                        {resumeDeleting ? "Deleting..." : "Delete Resume"}
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Upload PDF only. Maximum file size is 5MB.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Applied Jobs</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Track the jobs you have already applied for.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      {appliedJobs.length} applied
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {appliedJobs.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                        No applied jobs yet. Open the Jobs page and mark a role as applied after submitting on the company site.
                      </div>
                    ) : (
                      appliedJobs.map((job: any) => (
                        <div key={job.applicationId || job.jobId} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                              <p className="mt-1 text-sm text-slate-600">{job.companyName}</p>
                            </div>
                            <div className="text-sm text-slate-500">
                              Applied on{" "}
                              {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : "recently"}
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{job.description}</p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <span className="rounded-full bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
                              {job.location || "Location not specified"}
                            </span>
                            {job.applicationLink && (
                              <a
                                href={job.applicationLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Apply Link
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex rounded-xl bg-secondary/10 p-3 text-secondary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Next Steps</h2>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>Review your profile details fetched from the database.</li>
                    <li>Edit your academic details here whenever they change.</li>
                    <li>Check placement announcements regularly.</li>
                  </ul>
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
