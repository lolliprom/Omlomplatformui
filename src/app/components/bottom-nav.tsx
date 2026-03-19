import { Link, useLocation } from "react-router";
import { Calendar, Home, ListTodo, Trophy, User, Users } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/tasks", icon: ListTodo, label: "Tasks" },
    { path: "/calendar", icon: Calendar, label: "Plan" },
    { path: "/social", icon: Users, label: "Feed" },
    { path: "/leaderboard", icon: Trophy, label: "Rank" },
    { path: "/profile", icon: User, label: "Me" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-2xl transition-colors ${
                isActive ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              <div
                className={`rounded-full px-2 py-1 transition-colors ${
                  isActive ? "bg-indigo-50" : "bg-transparent"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-2" : "stroke-1.5"}`} />
              </div>
              <span className="text-[10px] uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
