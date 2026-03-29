import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Target, Eye, CheckCircle, User } from "lucide-react";

export function AboutPlacementCell() {
  const placementSteps = [
    { step: 1, title: "Company Registration", description: "Companies register through our portal" },
    { step: 2, title: "Job Posting", description: "Companies post job requirements and criteria" },
    { step: 3, title: "Student Application", description: "Eligible students apply for opportunities" },
    { step: 4, title: "Screening", description: "Initial screening and shortlisting process" },
    { step: 5, title: "Assessment", description: "Written tests and technical assessments" },
    { step: 6, title: "Interviews", description: "HR and technical interview rounds" },
    { step: 7, title: "Selection", description: "Final selection and offer letters" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">About Placement Cell</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Empowering students to achieve their career aspirations through industry partnerships
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                To provide comprehensive placement assistance and career guidance to our students, 
                ensuring they secure rewarding positions in reputed organizations. We strive to 
                create a robust platform that connects talented individuals with industry leaders, 
                fostering mutually beneficial relationships.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed">
                To be recognized as a premier placement cell that consistently delivers exceptional 
                talent to the industry while ensuring 100% placement for our students. We envision 
                building long-lasting partnerships with organizations worldwide and creating success 
                stories that inspire future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Message from Placement Officer */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">mr. Sumit choudhury</h3>
                <p className="text-slate-600">Chief Placement Officer</p>
              </div>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Dear Students and Recruiters,
              </p>
              <p>
                It gives me immense pleasure to welcome you to our Placement Cell. Over the years, 
                we have built strong relationships with leading companies across various sectors, 
                ensuring our students get exposure to diverse career opportunities.
              </p>
              <p>
                Our team works tirelessly to prepare students for the corporate world through 
                training sessions, mock interviews, and personality development programs. We believe 
                in nurturing not just academically sound individuals, but well-rounded professionals 
                ready to take on real-world challenges.
              </p>
              <p>
                To our recruiting partners, thank you for your continued trust in our institution. 
                We look forward to building more success stories together.
              </p>
              <p className="font-semibold text-slate-900">
                Best Regards,<br />
                mr Sumit Choudhury
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Placement Process</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              A systematic approach ensuring fair and efficient recruitment for all stakeholders
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line - Desktop */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-200"></div>

            <div className="space-y-8">
              {placementSteps.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"}`}>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold">{item.step}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Dot - Desktop */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-accent rounded-full border-4 border-white shadow"></div>
                  </div>

                  {/* Empty Space for alternating layout */}
                  <div className="hidden lg:block flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Key Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Dedicated Training & Development Programs",
              "Pre-placement Talk Sessions",
              "Mock Interviews & Group Discussions",
              "Resume Building Workshops",
              "Industry Expert Interactions",
              "Soft Skills Development",
              "Technical Skill Enhancement",
              "Career Counseling Sessions",
              "Company-Specific Preparation",
            ].map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
