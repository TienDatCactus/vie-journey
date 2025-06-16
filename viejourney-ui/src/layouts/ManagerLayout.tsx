import { ReactNode, useState } from "react";
import { NavManager } from "../components/Layout/Manager/nav";

const ManagerLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <NavManager collapsed={collapsed} setCollapsed={setCollapsed} />
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

export default ManagerLayout;
