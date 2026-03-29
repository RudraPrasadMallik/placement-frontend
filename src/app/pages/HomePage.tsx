import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router";
import { Building2, Users, TrendingUp, Award, ArrowRight, LogIn } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LoginModal } from "../components/LoginModal";
import { useState, useEffect } from "react";
import { api } from "./services/api"; // Add this import

export function HomePage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState("student");
  const [statsData, setStatsData] = useState({
    highestPackage: "₹45 LPA",
    averagePackage: "₹12 LPA",
    companiesVisited: "150+",
    studentsPlaced: "95%"
  });

  // Add this useEffect to fetch real data from API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const yearWiseData = await api.getYearWiseStats();
        
        if (yearWiseData && yearWiseData.length > 0) {
          const latestYear = yearWiseData[yearWiseData.length - 1];
          const placementPercentage = ((latestYear.placed / latestYear.total) * 100).toFixed(0);
          
          setStatsData({
            highestPackage: "₹45 LPA", // Keep static or fetch from API if available
            averagePackage: `₹${latestYear.avgPackage} LPA`,
            companiesVisited: "150+", // Keep static or fetch from API if available
            studentsPlaced: `${placementPercentage}%`
          });
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        // Keep default values if API fails
      }
    };

    fetchStatistics();
  }, []);

  // Update stats array with dynamic data
  const stats = [
    { label: "Highest Package", value: statsData.highestPackage, icon: TrendingUp },
    { label: "Average Package", value: statsData.averagePackage, icon: Award },
    { label: "Companies Visited", value: statsData.companiesVisited, icon: Building2 },
    { label: "Students Placed", value: statsData.studentsPlaced, icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary to-slate-800 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Welcome to EATM Placement Cell
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed">
                Building bridges between talented students and leading organizations. 
                Your career journey starts here.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/students"
                  className="bg-accent text-accent-foreground px-8 py-3 rounded-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => {
                    setLoginModalOpen(true);
                    setLoginType("company");
                  }}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 inline-flex items-center gap-2"
                >
                  Company Login
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxNTc5NzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Professional Meeting"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Placement Statistics 2025-26</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our commitment to excellence is reflected in our outstanding placement record
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761469354504-8d14b3a33757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBmb3JtYWwlMjBhdHRpcmUlMjBncmFkdWF0aW9ufGVufDF8fHx8MTc3MTYwNDkxN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Students"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">
                Why Recruit From Our Institution?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Top Talent Pool</h3>
                    <p className="text-slate-600">
                      Access to highly skilled graduates from diverse academic backgrounds
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Industry-Ready Skills</h3>
                    <p className="text-slate-600">
                      Students trained in latest technologies and industry practices
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Seamless Process</h3>
                    <p className="text-slate-600">
                      Dedicated support team to ensure smooth recruitment experience
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Strong Alumni Network</h3>
                    <p className="text-slate-600">
                      Our graduates excel in leading companies worldwide
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/recruiters"
                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                Learn More About Recruiting
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-slate-200 mb-8 max-w-2xl mx-auto">
            Whether you're a student seeking opportunities or a company looking for talent, 
            we're here to help you succeed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/students"
              className="bg-accent text-accent-foreground px-8 py-3 rounded-lg hover:bg-accent/90 transition-all shadow-lg"
            >
              Student Registration
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        type={loginType}
      />
    </div>
  );
}