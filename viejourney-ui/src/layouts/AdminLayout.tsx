import { ReactNode, useState } from "react";
import { NavAdmin } from "../components/Layout/Admin/nav";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <NavAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
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
