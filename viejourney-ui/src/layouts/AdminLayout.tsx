import { ReactNode } from "react";
import { NavAdmin } from "../components/Layout/Admin/nav";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      <NavAdmin />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default AdminLayout;
