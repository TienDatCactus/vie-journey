import { ReactNode, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article"
import { Nav } from "../components/Nav";

const ManagerLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
const menuItems = [{ icon: <ArticleIcon />, label: "Blog", path: "/manager/blog" }]

  return (
    <>
      <Nav collapsed={collapsed} setCollapsed={setCollapsed} menuItems={menuItems}/>
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
