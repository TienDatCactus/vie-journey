import {
  AccountCircle,
  AdminPanelSettings,
  Article,
  Dashboard,
  Hotel,
  PermMedia,
} from "@mui/icons-material";
import { ReactNode, useState } from "react";
import { Nav } from "../components/Nav";
import { useAuthStore } from "../services/stores/useAuthStore";
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  const adminItems = [
    { icon: <Dashboard />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <AccountCircle />, label: "Account", path: "/admin/accounts" },
    {
      icon: <AdminPanelSettings />,
      label: "Role",
      path: "/admin/role-management",
    },
  ];
  const managerItems = [
    { icon: <Article />, label: "Blog", path: "/manager/blogs" },
    { icon: <Hotel />, label: "Hotel", path: "/manager/hotels" },
    { icon: <PermMedia />, label: "Media", path: "/manager/media" },
  ];

  return (
    <>
      <Nav
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        menuItems={user?.role === "ADMIN" ? adminItems : managerItems}
      />
      <div
        className={` transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
