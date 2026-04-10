import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Building2, Users, Award, TrendingUp, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { api } from "./services/api";

export function RecruitersPage() {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,15}$/;
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    customIndustry: "",
    contactPerson: "",
    email: "",
    password: "",
    phone: "",
    website: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fieldLabels = {
    companyName: "Company Name",
    industry: "Industry",
    customIndustry: "Custom Industry",
    contactPerson: "Contact Person",
    email: "Email Address",
    password: "Password",
    phone: "Phone Number",
    website: "Company Website",
  };

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
      if (formData.industry === "Other" && !formData.customIndustry.trim()) {
        setFieldErrors({ customIndustry: "Please enter the industry name" });
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

      // Map industry values to match backend expectations
      const industryMap = {
        "IT": "Information Technology",
        "Finance": "Finance & Banking",
        "Consulting": "Consulting",
        "Manufacturing": "Manufacturing",
        "Healthcare": "Healthcare",
        "Other": "Other"
      };
      
      const submitData = new FormData();
      submitData.append("companyName", formData.companyName);
      submitData.append(
        "industry",
        formData.industry === "Other"
          ? formData.customIndustry.trim()
          : industryMap[formData.industry] || formData.industry
      );
      submitData.append("contactPerson", formData.contactPerson);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("phone", formData.phone);
      submitData.append("website", formData.website);
      
      const response = await api.registerCompany(submitData);
      
      setSuccessMessage(
        response?.message || "Registration submitted successfully! We'll contact you soon."
      );
      setShowSuccessPopup(true);
      setError("");
      setFieldErrors({});
      setFormData({
        companyName: "",
        industry: "",
        customIndustry: "",
        contactPerson: "",
        email: "",
        password: "",
        phone: "",
        website: "",
      });
      setShowPassword(false);
    } catch (err) {
      const nextFieldErrors = err.fieldErrors || {};
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

  const pastRecruiters = [
    "Microsoft", "Google", "Amazon", "TCS", "Infosys",
    "Wipro", "Cognizant", "Accenture", "Deloitte", "KPMG",
    "Goldman Sachs", "Morgan Stanley", "Flipkart", "Paytm", "Adobe"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">For Recruiters</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Partner with us to hire talented and industry-ready graduates
          </p>
        </div>
      </section>

      {/* Why Recruit From Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Why Recruit From Our University?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">1000+ Students</h3>
              <p className="text-slate-600 text-sm">
                Large pool of talented graduates from diverse streams
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Top Performers</h3>
              <p className="text-slate-600 text-sm">
                Students with excellent academic records and practical skills
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Industry Aligned</h3>
              <p className="text-slate-600 text-sm">
                Curriculum designed with industry requirements in mind
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Proven Track Record</h3>
              <p className="text-slate-600 text-sm">
                95%+ placement rate with top companies year after year
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Registration Form */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Company Registration Form</h2>
            
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
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData({ ...formData, companyName: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, companyName: "" }));
                    }}
                    className={getInputClassName("companyName")}
                    placeholder="ABC Corporation"
                  />
                  {renderFieldError("companyName")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        industry: e.target.value,
                        customIndustry: e.target.value === "Other" ? formData.customIndustry : "",
                      });
                      setFieldErrors((prev) => ({ ...prev, industry: "", customIndustry: "" }));
                    }}
                    className={getInputClassName("industry")}
                  >
                    <option value="">Select Industry</option>
                    <option value="IT">Information Technology</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                  {renderFieldError("industry")}
                </div>

                {formData.industry === "Other" && (
                  <div>
                    <label className="block text-slate-700 mb-2">
                      Enter Industry Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customIndustry}
                      onChange={(e) => {
                        setFormData({ ...formData, customIndustry: e.target.value });
                        setFieldErrors((prev) => ({ ...prev, customIndustry: "" }));
                      }}
                      className={getInputClassName("customIndustry")}
                      placeholder="Enter your industry"
                    />
                    {renderFieldError("customIndustry")}
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => {
                      setFormData({ ...formData, contactPerson: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, contactPerson: "" }));
                    }}
                    className={getInputClassName("contactPerson")}
                    placeholder="John Doe"
                  />
                  {renderFieldError("contactPerson")}
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
                    placeholder="hr@company.com"
                  />
                  {renderFieldError("email")}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
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
                  <p className="mt-1 text-sm text-slate-500">
                    8-15 characters with 1 uppercase letter, 1 number, and 1 special character.
                  </p>
                  {renderFieldError("password")}
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
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => {
                      setFormData({ ...formData, website: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, website: "" }));
                    }}
                    className={getInputClassName("website")}
                    placeholder="https://company.com"
                  />
                  {renderFieldError("website")}
                </div>

                <div className="md:col-span-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5">
                  <h3 className="text-base font-semibold text-slate-900">Next step after approval</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Once the admin approves your company account, you can log in to the company dashboard,
                    edit your registration details, and create jobs with job name, application link,
                    description, and JD upload.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Past Recruiters */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Past Recruiters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {pastRecruiters.map((company, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-lg p-6 border border-slate-200 flex items-center justify-center hover:shadow-md transition-shadow"
              >
                <span className="font-semibold text-slate-700 text-center">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What We Offer</h2>
          <div className="space-y-4">
            {[
              "Single window interface for all recruitment activities",
              "Pre-placement talk facility",
              "Dedicated placement team support",
              "Well-equipped interview rooms and infrastructure",
              "Accommodation arrangements for outstation recruiters",
              "Shortlisted resumes based on your criteria",
              "Post-placement support and feedback",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-200 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Registration Successful</h3>
            <p className="mt-3 text-slate-600">{successMessage}</p>
            <button
              type="button"
              onClick={() => setShowSuccessPopup(false)}
              className="mt-6 inline-flex min-w-32 items-center justify-center rounded-lg bg-primary px-6 py-3 text-white shadow-lg transition-colors hover:bg-primary/90"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
