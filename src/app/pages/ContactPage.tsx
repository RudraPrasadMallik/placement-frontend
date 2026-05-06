import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Mail, Phone, MapPin, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { api } from "./services/api";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Map subject values to match backend expectations
      const subjectMap = {
        "student": "Student Query",
        "recruiter": "Recruiter Query",
        "general": "General Information",
        "other": "Other"
      };
      
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: subjectMap[formData.subject] || formData.subject,
        message: formData.message
      };
      
      await api.submitContact(submitData);
      
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            We're here to help. Reach out to our placement team for any queries
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Address</h3>
              <p className="text-slate-600 text-sm">
                Placement Cell, B Block<br />
                EATM Campus<br />
                Baniatangi, Khordha
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
              <p className="text-slate-600 text-sm">
                +91 1234567890<br />
                +91 0987654321<br />
                (Mon - Fri, 9 AM - 5 PM)
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600 text-sm">
                placements@eatm.edu<br />
                hr.placements@eatm.edu
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Office Hours</h3>
              <p className="text-slate-600 text-sm">
                Monday - Saturday<br />
                9:00 AM - 5:00 PM<br />
                Closed on Holidays
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Team Info */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    <option value="student">Student Query</option>
                    <option value="recruiter">Recruiter Query</option>
                    <option value="general">General Information</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Placement Officer Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Placement Team</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Mr. Alok Prasad Mishra</h3>
                      <p className="text-slate-600 text-sm mb-2">Chief Placement Officer</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>alokprasad@eatm.edu</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>+91 7008156776</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Mr. Debasish Rath</h3>
                      <p className="text-slate-600 text-sm mb-2">Assistant Placement Officer</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 text-accent" />
                          <span>debasish.rath@eatm.edu</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 text-accent" />
                          <span>+91 7008288297</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Mr. Satyam Mohanty</h3>
                      <p className="text-slate-600 text-sm mb-2">Training & Development Coordinator</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 text-secondary" />
                          <span>satyammohanty@eatm.edu</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 text-secondary" />
                          <span>+91 9853060726</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className="bg-slate-200 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">Map Location</p>
                    <p className="text-sm text-slate-500">EATM, Khordha</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "When does the placement season start?",
                answer: "The placement season typically begins in August and continues through March of the following year.",
              },
              {
                question: "How can companies register for campus recruitment?",
                answer: "Companies can register through our online portal on the Recruiters page or contact our placement office directly.",
              },
              {
                question: "What is the eligibility criteria for students?",
                answer: "Students must have a minimum CGPA of 6.5/10, no active backlogs, and at least 75% attendance to be eligible for placements.",
              },
              {
                question: "Do you provide training for students?",
                answer: "Yes, we conduct regular training sessions including aptitude tests, technical skill development, soft skills, and mock interviews.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-slate-50 rounded-lg border border-slate-200 p-6 group"
              >
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="ml-4 text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}