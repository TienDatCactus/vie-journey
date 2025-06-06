import {
  ChevronLeft,
  Dashboard,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: <Dashboard />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <AccountCircleIcon />, label: "Account", path: "/admin/accounts" },
  {
    icon: <PermMediaIcon />,
    label: "Media",
    children: [
      { label: "Banner", path: "/admin/media/banner" },
      { label: "Settings", path: "/admin/accounts/settings" },
    ],
  },
];

interface NavAdminProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const NavAdmin: React.FC<NavAdminProps> = ({ collapsed, setCollapsed }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && <h1 className="text-xl font-bold">My App</h1>}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          className="text-white"
        >
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </div>

      <div className="flex flex-col space-y-2 mt-4 overflow-y-auto flex-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Tooltip title={collapsed ? item.label : ""} placement="right">
              <div
                onClick={() => {
                  if (item.children) {
                    toggleMenu(item.label);
                  } else {
                    navigate(item.path!);
                  }
                }}
                className={`flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-all ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span className="ml-4">{item.label}</span>
                    {item.children && (
                      <span className="ml-auto">
                        {openMenus[item.label] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </span>
                    )}
                  </>
                )}
              </div>
            </Tooltip>

            {/* Submenu */}
            {!collapsed && item.children && openMenus[item.label] && (
              <div className="ml-12 mt-1 space-y-1">
                {item.children.map((child, childIdx) => (
                  <div
                    key={childIdx}
                    onClick={() => navigate(child.path)}
                    className="flex items-center px-2 py-1 hover:bg-gray-600 cursor-pointer text-sm rounded"
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};