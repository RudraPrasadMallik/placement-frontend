import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { api } from "./services/api";

export function StatisticsPage() {
  const [yearWiseData, setYearWiseData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [packageDistribution, setPackageDistribution] = useState([]);
  const [companyTypeData, setCompanyTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const COLORS = ["#1e3a8a", "#3b82f6", "#d4af37", "#64748b", "#0ea5e9"];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Fetch all statistics in parallel
        const [yearWise, departmentWise, packageDist, companyTypes] = await Promise.all([
          api.getYearWiseStats(),
          api.getDepartmentWiseStats(),
          api.getPackageDistribution(),
          api.getCompanyTypes()
        ]);
        
        setYearWiseData(yearWise);
        setDepartmentData(departmentWise);
        setPackageDistribution(packageDist);
        setCompanyTypeData(companyTypes);
        
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError("Failed to load statistics. Please refresh the page.");
        
        // Fallback to static data if API fails
        setYearWiseData([
          { year: "2021-22", placed: 420, total: 450, avgPackage: 8.5 },
          { year: "2022-23", placed: 485, total: 520, avgPackage: 10.2 },
          { year: "2023-24", placed: 512, total: 550, avgPackage: 11.5 },
          { year: "2024-25", placed: 548, total: 580, avgPackage: 12.0 },
          { year: "2025-26", placed: 587, total: 620, avgPackage: 13.2 },
        ]);
        
        setDepartmentData([
          { department: "CSE", placed: 145, total: 150 },
          { department: "ECE", placed: 118, total: 130 },
          { department: "EEE", placed: 95, total: 110 },
          { department: "ME", placed: 88, total: 100 },
          { department: "CE", placed: 75, total: 90 },
          { department: "MCA", placed: 90, total: 100},
          { department: "MBA", placed: 70, total: 85}
        ]);
        
        setPackageDistribution([
          { range: "0-5 LPA", count: 85 },
          { range: "5-10 LPA", count: 180 },
          { range: "10-15 LPA", count: 195 },
          { range: "15-20 LPA", count: 92 },
          { range: "20+ LPA", count: 35 },
          { range: "30+ LPA", count: 80}
        ]);
        
        setCompanyTypeData([
          { name: "IT/Software", value: 45 },
          { name: "Consulting", value: 20 },
          { name: "Core Engineering", value: 15 },
          { name: "Finance", value: 12 },
          { name: "Others", value: 8 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Calculate key metrics from actual data
  const getKeyMetrics = () => {
    if (yearWiseData.length === 0) {
      return {
        placementRate: "95%",
        highestPackage: "₹45 LPA",
        averagePackage: "₹13.2 LPA",
        companiesParticipated: "150+"
      };
    }
    
    const latestYear = yearWiseData[yearWiseData.length - 1];
    const placementRate = ((latestYear.placed / latestYear.total) * 100).toFixed(0);
    
    return {
      placementRate: `${placementRate}%`,
      highestPackage: "₹45 LPA", // Keep static as API doesn't have this yet
      averagePackage: `₹${latestYear.avgPackage} LPA`,
      companiesParticipated: "150+" // Keep static as API doesn't have this yet
    };
  };

  const metrics = getKeyMetrics();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600">Loading statistics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Placement Statistics</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Comprehensive data showcasing our placement performance over the years
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-primary to-blue-700 text-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold mb-2">{metrics.placementRate}</div>
              <div className="text-blue-100">Overall Placement Rate</div>
            </div>
            <div className="bg-gradient-to-br from-accent to-yellow-600 text-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold mb-2">{metrics.highestPackage}</div>
              <div className="text-yellow-100">Highest Package 2025-26</div>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold mb-2">{metrics.averagePackage}</div>
              <div className="text-slate-300">Average Package 2025-26</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold mb-2">{metrics.companiesParticipated}</div>
              <div className="text-blue-200">Companies Participated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Year-wise Placement Trend */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Year-wise Placement Trends
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Placement Numbers */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Students Placed</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px" 
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="placed" fill="#1e3a8a" name="Placed" />
                  <Bar dataKey="total" fill="#d4af37" name="Total Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Package Trend */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Average Package Trend (LPA)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px" 
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgPackage" 
                    stroke="#1e3a8a" 
                    strokeWidth={3}
                    name="Avg Package (LPA)"
                    dot={{ fill: "#d4af37", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year-wise Table */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Academic Year</th>
                    <th className="px-6 py-4 text-left">Total Students</th>
                    <th className="px-6 py-4 text-left">Students Placed</th>
                    <th className="px-6 py-4 text-left">Placement %</th>
                    <th className="px-6 py-4 text-left">Avg Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {yearWiseData.map((data, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{data.year}</td>
                      <td className="px-6 py-4 text-slate-600">{data.total}</td>
                      <td className="px-6 py-4 text-slate-600">{data.placed}</td>
                      <td className="px-6 py-4 text-accent font-semibold">
                        {((data.placed / data.total) * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-slate-600">₹{data.avgPackage} LPA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Department-wise Performance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Department-wise Performance (2025-26)
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Department Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Placement by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="department" type="category" stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px" 
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="placed" fill="#1e3a8a" name="Placed" />
                  <Bar dataKey="total" fill="#d4af37" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Department Table */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Department</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Placed</th>
                    <th className="px-6 py-4 text-left">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{dept.department}</td>
                      <td className="px-6 py-4 text-slate-600">{dept.total}</td>
                      <td className="px-6 py-4 text-slate-600">{dept.placed}</td>
                      <td className="px-6 py-4">
                        <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                          {((dept.placed / dept.total) * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Package Distribution and Company Types */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Additional Insights (2025-26)
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Package Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Package Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={packageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px" 
                    }} 
                  />
                  <Bar dataKey="count" fill="#3b82f6" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Company Type Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Companies by Sector (%)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={companyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {companyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px" 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}