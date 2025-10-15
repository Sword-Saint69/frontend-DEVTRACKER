import { Settings, CircleUserRound } from "lucide-react";
import Tooltip from "./ui/Tooltip";
import "./ui/Tooltip.css";
import SideNavbar from "./SideNavbar";
import { Outlet, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import UserProfile from "./UserProfile";
import ProjectSearch from "./ProjectSearch";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);

  const dropdownRef = useRef<HTMLLIElement | null>(null);

  const navIcons = [
    { icon: Settings, label: "Settings", link: "/settings" },
    { icon: CircleUserRound, label: "Profile", isProfile: true },
  ];

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="d-flex flex-column position-fixed z-2 w-full"
      style={{ width: "100vw" }}
    >
      <div className="d-flex bg-white dark:bg-slate-900 justify-content-between border-b border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-lg px-4 md:px-6 py-3">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight m-0">
            DevTracker.
          </h2>
        </div>

        {/* Search */}
        <div className="d-flex align-items-center justify-content-end gap-3 w-50">
          <ProjectSearch />
        </div>

        {/* Icons */}
        <div>
          <ul className="list-unstyled d-flex flex-row m-0 gap-2 md:gap-3">
            {/* Theme Toggler */}
            <li className="position-relative">
              <Tooltip
                text="Toggle Theme"
                mobilePosition="bottom"
                desktopPosition="bottom"
              >
                <div className="d-flex align-items-center justify-content-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer">
                  <AnimatedThemeToggler className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </Tooltip>
            </li>
            
            {navIcons.map((item, index) => (
              <li
                key={index}
                className="position-relative"
                ref={item.isProfile ? dropdownRef : null}
              >
                <Tooltip
                  text={item.label}
                  mobilePosition="bottom"
                  desktopPosition="bottom"
                >
                  {item.link ? (
                    <Link 
                      to={item.link} 
                      className="d-flex align-items-center justify-content-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </Link>
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() =>
                        item.isProfile ? setOpenProfile((prev) => !prev) : null
                      }
                    >
                      <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  )}
                </Tooltip>

                {/* Profile Dropdown */}
                {item.isProfile && openProfile && (
                  <UserProfile onClose={() => setOpenProfile(false)} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Side Navbar */}
      <SideNavbar />

      {/* Main content */}
      <main>
        <Outlet />
      </main>
    </nav>
  );
}
