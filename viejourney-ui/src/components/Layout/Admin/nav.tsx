import {
  AdminPanelSettings,
  ChevronLeft,
  Dashboard,
  Menu as MenuIcon,
} from "@mui/icons-material";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: <Dashboard />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <AccountCircleIcon />, label: "Account", path: "/admin/accounts" },
  { icon: <PermMediaIcon />, label: "Media", path: "/admin/media" },
  {
    icon: <AdminPanelSettings />,
    label: "Role Management",
    path: "/admin/role-management",
  },
];

interface NavAdminProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const NavAdmin: React.FC<NavAdminProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`fixed left-0 top-0 h-screen text-gray-800 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && <h1 className="text-xl font-bold">My App</h1>}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-800"
        >
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </div>

      <div className="flex flex-col space-y-2 mt-4 overflow-y-auto flex-1">
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            title={collapsed ? item.label : ""}
            placement="right"
          >
            <div
              onClick={() => navigate(item.path)}
              className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all ${
                collapsed ? "justify-center" : ""
              }`}
            >
              {item.icon}
              {!collapsed && <span className="ml-4">{item.label}</span>}
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
