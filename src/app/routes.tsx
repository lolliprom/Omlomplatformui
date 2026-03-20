import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/dashboard";
import Tasks from "./pages/tasks";
import Social from "./pages/social";
import Leaderboard from "./pages/leaderboard";
import Profile from "./pages/profile";
import Calendar from "./pages/calendar";
import Inventory from "./pages/inventory";
import Root from "./pages/root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "inventory", Component: Inventory },
      { path: "social", Component: Social },
      { path: "leaderboard", Component: Leaderboard },
      { path: "profile", Component: Profile },
      { path: "calendar", Component: Calendar },
    ],
  },
]);