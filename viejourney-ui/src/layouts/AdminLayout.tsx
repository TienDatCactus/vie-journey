import { AdminPanelSettings, Dashboard } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ReactNode, useState } from "react";
import { Nav } from "../components/Nav";
const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: <Dashboard />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <AccountCircleIcon />, label: "Account", path: "/admin/accounts" },

    {
      icon: <AdminPanelSettings />,
      label: "Role",
      path: "/admin/role-management",
    },
  ];
  return (
    <>
      <Nav
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        menuItems={menuItems}
      />
      <div
        className={`p-4 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default AdminLayout;
