import {
  ChevronLeft,
  Dashboard,
  Menu as MenuIcon,
} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: <Dashboard />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <AccountCircleIcon />, label: "Account", path: "/admin/accounts" },
];

const NavAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && <h1 className="text-xl font-bold">My App</h1>}
        <IconButton onClick={() => setCollapsed(!collapsed)} className="text-white">
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </div>

      <div className="flex flex-col space-y-2 mt-4">
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            title={collapsed ? item.label : ""}
            placement="right"
          >
            <div
              onClick={() => navigate(item.path)} 
              className={`flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-all ${
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

export default NavAdmin;
