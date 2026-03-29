import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Building2, Users, Award, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { api } from "./services/api";

export function RecruitersPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    positions: "",
    package: "",
    location: "",
    jobDescription: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Map industry values to match backend expectations
      const industryMap = {
        "IT": "Information Technology",
        "Finance": "Finance & Banking",
        "Consulting": "Consulting",
        "Manufacturing": "Manufacturing",
        "Healthcare": "Healthcare",
        "Other": "Other"
      };
      
      const submitData = {
        companyName: formData.companyName,
        industry: industryMap[formData.industry] || formData.industry,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        positions: parseInt(formData.positions),
        salaryPackage: formData.package,
        location: formData.location,
        jobDescription: formData.jobDescription
      };
      
      await api.registerCompany(submitData);
      
      setSubmitted(true);
      setFormData({
        companyName: "",
        industry: "",
        contactPerson: "",
        email: "",
        phone: "",
        website: "",
        positions: "",
        package: "",
        location: "",
        jobDescription: "",
      });
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Registration submitted successfully! We'll contact you soon.</p>
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
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ABC Corporation"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    <option value="IT">Information Technology</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="hr@company.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Number of Positions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.positions}
                    onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Package (LPA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="8-12 LPA"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 mb-2">
                    Job Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Bangalore, Hyderabad"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of the role, responsibilities, and requirements..."
                  ></textarea>
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
    </div>
  );
}