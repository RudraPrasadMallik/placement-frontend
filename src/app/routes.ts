import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AboutPlacementCell } from "./pages/AboutPlacementCell";
import { StudentsPage } from "./pages/StudentsPage";
import { RecruitersPage } from "./pages/RecruitersPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { ContactPage } from "./pages/ContactPage";

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
    path: "/recruiters",
    Component: RecruitersPage,
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
