import ArticleIcon from "@mui/icons-material/Article";
import { ReactNode, useState } from "react";
import { Nav } from "../components/Nav";
import { Hotel, PermMedia } from "@mui/icons-material";

const ManagerLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [
    { icon: <ArticleIcon />, label: "Blog", path: "/manager/blogs" },
    { icon: <Hotel />, label: "Hotel", path: "/admin/hotels" },
    { icon: <PermMedia />, label: "Media", path: "/admin/media" },
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

export default ManagerLayout;
