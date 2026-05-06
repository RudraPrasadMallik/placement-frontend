import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Upload, CheckCircle, FileText, AlertCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./services/api";

export function StudentsPage() {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,15}$/;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    department: "",
    year: "",
    cgpa: "",
    password: "",
    resume: null,
  });
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadRegistrationOptions = async () => {
      try {
        setOptionsError("");
        const response = await api.getStudentRegistrationOptions();
        const nextDepartments = response?.departments?.map((item) => item.value).filter(Boolean) || [];
        const nextYears = response?.years?.map((item) => item.value).filter(Boolean) || [];

        setDepartmentOptions(nextDepartments);
        setYearOptions(nextYears);
      } catch (err) {
        console.error("Failed to load registration options:", err);
        setDepartmentOptions([]);
        setYearOptions([]);
        setOptionsError("Registration options are not available right now. Please contact admin.");
      } finally {
        setOptionsLoading(false);
      }
    };

    loadRegistrationOptions();
  }, []);

  const getInputClassName = (fieldName) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
      fieldErrors[fieldName] ? "border-red-400 bg-red-50" : "border-slate-300"
    }`;

  const renderFieldError = (fieldName) =>
    fieldErrors[fieldName] ? (
      <p className="mt-1 text-sm text-red-600">{fieldErrors[fieldName]}</p>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    
    try {
      if (departmentOptions.length === 0) {
        setError("No department options are available. Please contact admin.");
        setLoading(false);
        return;
      }

      if (yearOptions.length === 0) {
        setError("No year options are available. Please contact admin.");
        setLoading(false);
        return;
      }

      const cgpaValue = parseFloat(formData.cgpa);
      if (cgpaValue < 6.5) {
        setFieldErrors({ cgpa: "Minimum CGPA required is 6.5" });
        setError("Please fix the highlighted fields.");
        setLoading(false);
        return;
      }

      if (formData.password.trim().length < 8 || formData.password.trim().length > 15) {
        setFieldErrors({ password: "Password must be between 8 and 15 characters" });
        setError("Please fix the highlighted fields.");
        setLoading(false);
        return;
      }

      if (!passwordPattern.test(formData.password.trim())) {
        setFieldErrors({
          password: "Use 1 uppercase letter, 1 number, and 1 special character",
        });
        setError("Please fix the highlighted fields.");
        setLoading(false);
        return;
      }
      
      if (!formData.resume) {
        setFieldErrors({ resume: "Please upload your resume" });
        setError("Please fix the highlighted fields.");
        setLoading(false);
        return;
      }
      
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("regd.Number", formData.rollNumber);
      submitData.append("department", formData.department);
      submitData.append("year", formData.year);
      submitData.append("cgpa", formData.cgpa);
      submitData.append("password", formData.password);
      submitData.append("resume", formData.resume);
      
      await api.registerStudent(submitData);
      
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        rollNumber: "",
        department: "",
        year: "",
        cgpa: "",
        password: "",
        resume: null,
      });
      setShowPassword(false);
      
      const fileInput = document.getElementById("resume-upload") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      
      setFieldErrors({});
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      const nextFieldErrors = { ...(err.fieldErrors || {}) };
      if (err.field) {
        nextFieldErrors[err.field] = err.message;
      }
      setFieldErrors(nextFieldErrors);
      if (Object.keys(nextFieldErrors).length > 0) {
        setError("Please fix the highlighted fields.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setFieldErrors({ resume: "Only PDF files are allowed" });
        setError("Please fix the highlighted fields.");
        e.target.value = "";
        setFormData((prev) => ({ ...prev, resume: null }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors({ resume: "Resume file size must not exceed 5MB" });
        setError("Please fix the highlighted fields.");
        e.target.value = "";
        setFormData((prev) => ({ ...prev, resume: null }));
        return;
      }
      
      setFormData({ ...formData, resume: file });
      setFieldErrors((prev) => ({ ...prev, resume: "" }));
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-to-br from-primary to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">For Students</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Register for placement opportunities and kickstart your career journey
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Eligibility Criteria</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  Academic Requirements
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>â€¢ Minimum CGPA: 6.5/10</li>
                  <li>â€¢ No active backlogs</li>
                  <li>â€¢ Regular student (not lateral entry for some companies)</li>
                  <li>â€¢ Attendance: Minimum 75%</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  General Requirements
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>â€¢ Must be in final year</li>
                  <li>â€¢ Valid email and phone number</li>
                  <li>â€¢ Updated resume in PDF format</li>
                  <li>â€¢ Professional photograph</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Student Registration Form</h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Registration submitted successfully!</p>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    className={getInputClassName("fullName")}
                    placeholder="John Doe"
                  />
                  {renderFieldError("fullName")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={getInputClassName("email")}
                    placeholder="john@example.com"
                  />
                  {renderFieldError("email")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={getInputClassName("phone")}
                    placeholder="+91 9876543210"
                  />
                  {renderFieldError("phone")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Rigistrationnumber <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, rollNumber: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, rollNumber: "" }));
                    }}
                    className={getInputClassName("rollNumber")}
                    placeholder="2021001"
                  />
                  {renderFieldError("rollNumber")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      maxLength={15}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setFieldErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      className={`${getInputClassName("password")} pr-12`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    8-15 characters, with 1 uppercase letter, 1 number, and 1 special character.
                  </p>
                  {renderFieldError("password")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    disabled={optionsLoading || departmentOptions.length === 0}
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, department: "" }));
                    }}
                    className={getInputClassName("department")}
                  >
                    <option value="">
                      {optionsLoading
                        ? "Loading Departments..."
                        : departmentOptions.length === 0
                          ? "No Departments Available"
                          : "Select Department"}
                    </option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {!optionsLoading && departmentOptions.length === 0 && (
                    <p className="mt-1 text-sm text-amber-700">No department data found. Please contact admin.</p>
                  )}
                  {renderFieldError("department")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    disabled={optionsLoading || yearOptions.length === 0}
                    value={formData.year}
                    onChange={(e) => {
                      setFormData({ ...formData, year: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, year: "" }));
                    }}
                    className={getInputClassName("year")}
                  >
                    <option value="">
                      {optionsLoading
                        ? "Loading Years..."
                        : yearOptions.length === 0
                          ? "No Years Available"
                          : "Select Year"}
                    </option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {!optionsLoading && yearOptions.length === 0 && (
                    <p className="mt-1 text-sm text-amber-700">No year data found. Please contact admin.</p>
                  )}
                  {renderFieldError("year")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    CGPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={formData.cgpa}
                    onChange={(e) => {
                      setFormData({ ...formData, cgpa: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, cgpa: "" }));
                    }}
                    className={getInputClassName("cgpa")}
                    placeholder="8.5"
                  />
                  {renderFieldError("cgpa")}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">
                  Upload Resume (PDF) <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${
                  fieldErrors.resume ? "border-red-400 bg-red-50" : "border-slate-300"
                }`}>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="mx-auto max-w-full break-words text-slate-600">
                      {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">PDF (Max 5MB)</p>
                  </label>
                </div>
                {renderFieldError("resume")}
              </div>

              <button
                type="submit"
                disabled={loading || optionsLoading || departmentOptions.length === 0 || yearOptions.length === 0}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </button>
              {optionsError && (
                <p className="text-sm text-amber-700">{optionsError}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Placement Guidelines</h2>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-primary">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Before the Placement Drive
                </h3>
                <ul className="space-y-2 text-slate-600 ml-7">
                  <li> Keep your resume updated and error-free</li>
                  <li> Maintain professional email communication</li>
                  <li> Attend pre-placement talks regularly</li>
                  <li> Practice aptitude and technical questions</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-accent">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  During the Placement Drive
                </h3>
                <ul className="space-y-2 text-slate-600 ml-7">
                  <li> Dress formally and professionally</li>
                  <li> Be punctual for all rounds</li>
                  <li> Carry multiple copies of your resume</li>
                  <li> Stay confident and communicate clearly</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-secondary">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                  Important Points
                </h3>
                <ul className="space-y-2 text-slate-600 ml-7">
                  <li> One student can apply to multiple companies</li>
                  <li> Once selected, you cannot participate further</li>
                  <li> Maintain discipline throughout the process</li>
                  <li> Any misconduct will lead to disqualification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
