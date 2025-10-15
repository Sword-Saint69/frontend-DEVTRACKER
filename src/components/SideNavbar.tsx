import { Link, useLocation } from "react-router-dom";
import {
  Home,
  // Users,
  MessageSquareMore,
  Cuboid,
  Settings,
} from "lucide-react";
import { Dock, DockItem } from "./ui/dock";

function SideNavbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navlinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/messages", icon: MessageSquareMore, label: "Messages" },
    { path: "/projects", icon: Cuboid, label: "Projects" },
    // { path: "/members", icon: Users, label: "Members" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Dock className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
      {navlinks.map((link) => (
        <DockItem
          key={link.path}
          href={link.path}
          isActive={isActive(link.path)}
        >
          <link.icon className="w-6 h-6" />
        </DockItem>
      ))}
    </Dock>
  );
}

export default SideNavbar;