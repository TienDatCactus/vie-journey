import {
    ChevronLeft,
    Logout,
    Menu as MenuIcon,
    Settings
} from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

 interface NavProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    menuItems: MenuItem[];
  }

  
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}



export const Nav: React.FC<NavProps> = ({
  collapsed,
  setCollapsed,
  menuItems
}) => {
  const navigate = useNavigate();
  const user = {
    name: "John Doe",
    email: "john.doe@viejourney.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Admin",
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // navigate("/login")
  };

  const handleProfile = () => {
    // Add your profile navigation logic here
    console.log("Opening profile...");
    // navigate("/profile")
  };
  return (
    <div
      className={`fixed left-0 top-0 h-screen text-gray-800 flex flex-col transition-all duration-300 z-50 bg-white border-r border-gray-200 shadow-sm ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VJ</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VieJourney
            </h1>
          </div>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:bg-gray-100"
          size="small"
        >
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col space-y-1 mt-4 px-3 flex-1">
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            title={collapsed ? item.label : ""}
            placement="right"
          >
            <div
              onClick={() => navigate(item.path)}
              className={`flex items-center px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all group ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="text-gray-600 group-hover:text-blue-600">
                {item.icon}
              </div>
              {!collapsed && (
                <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-600">
                  {item.label}
                </span>
              )}
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Account Section */}
      <div className="mt-auto border-t border-gray-100">
        {!collapsed ? (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 40, height: 40 }}
                className="border-2 border-gray-200"
              >
                {user.name.charAt(0)}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <p className="text-xs text-blue-600 font-medium">{user.role}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Tooltip title="Profile Settings">
                <button
                  onClick={handleProfile}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Settings sx={{ fontSize: 16 }} />
                  Profile
                </button>
              </Tooltip>

              <Tooltip title="Sign Out">
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Logout sx={{ fontSize: 16 }} />
                  Logout
                </button>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-2">
            <Tooltip title={`${user.name} - Profile`} placement="right">
              <div className="flex justify-center">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                  className="border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all"
                  onClick={handleProfile}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </div>
            </Tooltip>

            <Tooltip title="Profile Settings" placement="right">
              <IconButton
                onClick={handleProfile}
                size="small"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <Settings sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sign Out" placement="right">
              <IconButton
                onClick={handleLogout}
                size="small"
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <Logout sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
