import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Upload, CheckCircle, FileText, AlertCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { api } from "./services/api";

export function StudentsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    department: "",
    year: "",
    cgpa: "",
    resume: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Validate CGPA
      const cgpaValue = parseFloat(formData.cgpa);
      if (cgpaValue < 6.5) {
        setError("Minimum CGPA required is 6.5");
        setLoading(false);
        return;
      }
      
      // Validate file
      if (!formData.resume) {
        setError("Please upload your resume");
        setLoading(false);
        return;
      }
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("rollNumber", formData.rollNumber);
      submitData.append("department", formData.department);
      submitData.append("year", formData.year);
      submitData.append("cgpa", formData.cgpa);
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
        resume: null,
      });
      
      // Reset file input
      const fileInput = document.getElementById("resume-upload");
      if (fileInput) fileInput.value = "";
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        setTimeout(() => setError(""), 3000);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setTimeout(() => setError(""), 3000);
        return;
      }
      
      setFormData({ ...formData, resume: file });
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">For Students</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Register for placement opportunities and kickstart your career journey
          </p>
        </div>
      </section>

      {/* Eligibility Criteria */}
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
                  <li>• Minimum CGPA: 6.5/10</li>
                  <li>• No active backlogs</li>
                  <li>• Regular student (not lateral entry for some companies)</li>
                  <li>• Attendance: Minimum 75%</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  General Requirements
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Must be in final year</li>
                  <li>• Valid email and phone number</li>
                  <li>• Updated resume in PDF format</li>
                  <li>• Professional photograph</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
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
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    placeholder="john@example.com"
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
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="2021001"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="CE">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
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
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="8.5"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-slate-700 mb-2">
                  Upload Resume (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
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
                    <p className="text-slate-600">
                      {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">PDF (Max 5MB)</p>
                  </label>
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

      {/* Placement Guidelines */}
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
                  <li>• Keep your resume updated and error-free</li>
                  <li>• Maintain professional email communication</li>
                  <li>• Attend pre-placement talks regularly</li>
                  <li>• Practice aptitude and technical questions</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-accent">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  During the Placement Drive
                </h3>
                <ul className="space-y-2 text-slate-600 ml-7">
                  <li>• Dress formally and professionally</li>
                  <li>• Be punctual for all rounds</li>
                  <li>• Carry multiple copies of your resume</li>
                  <li>• Stay confident and communicate clearly</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-secondary">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                  Important Points
                </h3>
                <ul className="space-y-2 text-slate-600 ml-7">
                  <li>• One student can apply to multiple companies</li>
                  <li>• Once selected, you cannot participate further</li>
                  <li>• Maintain discipline throughout the process</li>
                  <li>• Any misconduct will lead to disqualification</li>
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