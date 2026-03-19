import { createBrowserRouter, createHashRouter } from "react-router";
import Dashboard from "./pages/dashboard";
import Tasks from "./pages/tasks";
import Social from "./pages/social";
import Leaderboard from "./pages/leaderboard";
import Profile from "./pages/profile";
import Calendar from "./pages/calendar";
import Root from "./pages/root";

const routeConfig = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "social", Component: Social },
      { path: "leaderboard", Component: Leaderboard },
      { path: "profile", Component: Profile },
      { path: "calendar", Component: Calendar },
    ],
  },
];

const shouldUseHashRouter =
  typeof window !== "undefined" && window.location.protocol === "file:";

export const router = shouldUseHashRouter
  ? createHashRouter(routeConfig)
  : createBrowserRouter(routeConfig);
