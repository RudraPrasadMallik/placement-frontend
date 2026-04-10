import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AboutPlacementCell } from "./pages/AboutPlacementCell";
import { StudentsPage } from "./pages/StudentsPage";
import { RecruitersPage } from "./pages/RecruitersPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { ContactPage } from "./pages/ContactPage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { CompanyDashboardPage } from "./pages/CompanyDashboardPage";
import { JobsPage } from "./pages/JobsPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/about",
    Component: AboutPlacementCell,
  },
  {
    path: "/students",
    Component: StudentsPage,
  },
  {
    path: "/student-dashboard",
    Component: StudentDashboardPage,
  },
  {
    path: "/company-dashboard",
    Component: CompanyDashboardPage,
  },
  {
    path: "/admin-dashboard",
    Component: AdminDashboardPage,
  },
  {
    path: "/recruiters",
    Component: RecruitersPage,
  },
  {
    path: "/jobs",
    Component: JobsPage,
  },
  {
    path: "/statistics",
    Component: StatisticsPage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
]);
