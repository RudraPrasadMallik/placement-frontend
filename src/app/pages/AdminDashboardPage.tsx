import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { api, clearStoredAuth, getStoredAuth } from "./services/api";

const optionTypes = [
  { key: "DEPARTMENT", title: "Departments", placeholder: "Add department" },
  { key: "YEAR", title: "Years", placeholder: "Add year" },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState({ DEPARTMENT: false, YEAR: false });
  const [options, setOptions] = useState({ DEPARTMENT: [], YEAR: [] });
  const [formData, setFormData] = useState({ DEPARTMENT: "", YEAR: "" });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth) {
      navigate("/", { replace: true });
      return;
    }

    if (auth.role !== "ADMIN") {
      navigate("/", { replace: true });
      return;
    }

    const loadOptions = async () => {
      try {
        const [departments, years, studentRecords] = await Promise.all([
          api.getAdminRegistrationOptions("DEPARTMENT"),
          api.getAdminRegistrationOptions("YEAR"),
          api.getAdminStudents(),
        ]);

        setOptions({
          DEPARTMENT: departments,
          YEAR: years,
        });
        setStudents(Array.isArray(studentRecords) ? studentRecords : []);
      } catch (err: any) {
        if (err.message?.toLowerCase().includes("log in")) {
          clearStoredAuth();
          navigate("/", { replace: true });
          return;
        }
        setError(err.message || "Unable to load admin configuration.");
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [navigate]);

  const handleCreate = async (type: "DEPARTMENT" | "YEAR") => {
    const value = formData[type].trim();
    if (!value) return;

    setSaving((prev) => ({ ...prev, [type]: true }));
    setError("");

    try {
      const created = await api.createAdminRegistrationOption(type, {
        value,
        sortOrder: options[type].length,
      });

      setOptions((prev) => ({
        ...prev,
        [type]: [...prev[type], created],
      }));
      setFormData((prev) => ({ ...prev, [type]: "" }));
    } catch (err: any) {
      setError(err.message || `Unable to create ${type.toLowerCase()} option.`);
    } finally {
      setSaving((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDelete = async (type: "DEPARTMENT" | "YEAR", optionId: number) => {
    try {
      await api.deleteAdminRegistrationOption(optionId);
      setOptions((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== optionId),
      }));
    } catch (err: any) {
      setError(err.message || `Unable to delete ${type.toLowerCase()} option.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-slate-800 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold lg:text-5xl">Admin Dashboard</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">
              Manage the student registration dropdown values stored in the database.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                Loading admin settings...
              </div>
            )}

            {!loading && error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {!loading && (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {optionTypes.map((typeConfig) => (
                    <div
                      key={typeConfig.key}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <h2 className="text-xl font-semibold text-slate-900">{typeConfig.title}</h2>
                      <div className="mt-4 flex gap-3">
                        <input
                          type="text"
                          value={formData[typeConfig.key]}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [typeConfig.key]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder={typeConfig.placeholder}
                        />
                        <button
                          type="button"
                          onClick={() => handleCreate(typeConfig.key as "DEPARTMENT" | "YEAR")}
                          disabled={saving[typeConfig.key]}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                        >
                          {saving[typeConfig.key] ? "Saving..." : "Add"}
                        </button>
                      </div>

                      <div className="mt-6 space-y-3">
                        {options[typeConfig.key].length === 0 ? (
                          <p className="text-sm text-slate-500">No options added yet.</p>
                        ) : (
                          options[typeConfig.key].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                              <span className="text-sm text-slate-700">{item.value}</span>
                              <button
                                type="button"
                                onClick={() => handleDelete(typeConfig.key as "DEPARTMENT" | "YEAR", item.id)}
                                className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Student Records</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Review student profile data, resume, and all semester records added from the student dashboard.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      {students.length} students
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {students.length === 0 ? (
                      <p className="text-sm text-slate-500">No student records found yet.</p>
                    ) : (
                      students.map((student) => (
                        <div
                          key={student.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{student.fullName}</h3>
                              <p className="mt-1 text-sm text-slate-600">
                                {student.email} | {student.phoneNumber || "Phone not available"}
                              </p>
                            </div>
                            <span
                              className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${
                                student.active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {student.active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Roll Number</p>
                              <p className="mt-2 text-sm text-slate-800">{student.rollNumber || "-"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Department</p>
                              <p className="mt-2 text-sm text-slate-800">{student.department || "-"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Year</p>
                              <p className="mt-2 text-sm text-slate-800">{student.graduationYear || "-"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">CGPA</p>
                              <p className="mt-2 text-sm text-slate-800">{student.currentCgpa ?? "-"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resume</p>
                              {student.resumeUrl ? (
                                <a
                                  href={student.resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 inline-flex text-sm font-semibold text-primary hover:text-primary/80"
                                >
                                  {student.resumeFileName || "View resume"}
                                </a>
                              ) : (
                                <p className="mt-2 text-sm text-slate-500">Not uploaded</p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                                  Semesters
                                </h4>
                                <p className="mt-1 text-sm text-slate-600">
                                  Semester entries and marksheets uploaded from the student dashboard.
                                </p>
                              </div>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                {student.semesterRecords?.length || 0} added
                              </span>
                            </div>

                            {student.semesterRecords && student.semesterRecords.length > 0 ? (
                              <div className="mt-4 space-y-3">
                                {student.semesterRecords.map((record) => (
                                  <div
                                    key={record.id}
                                    className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.2fr_0.8fr_1fr]"
                                  >
                                    <div>
                                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Semester Name
                                      </p>
                                      <p className="mt-2 text-sm font-semibold text-slate-900">
                                        {record.semesterName}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Percentage
                                      </p>
                                      <p className="mt-2 text-sm text-slate-800">
                                        {record.percentage !== null && record.percentage !== undefined
                                          ? `${record.percentage}%`
                                          : "Not added"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Marksheet
                                      </p>
                                      {record.marksheetUrl ? (
                                        <a
                                          href={record.marksheetUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="mt-2 inline-flex text-sm font-semibold text-primary hover:text-primary/80"
                                        >
                                          {record.marksheetName || "View marksheet"}
                                        </a>
                                      ) : (
                                        <p className="mt-2 text-sm text-slate-500">Not uploaded</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                No semester records added yet.
                              </div>
                            )}
                          </div>
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
