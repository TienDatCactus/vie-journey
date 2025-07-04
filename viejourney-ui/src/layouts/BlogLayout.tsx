import { Grid2 } from "@mui/material";
import SideHeader from "../components/Layout/Blog/SideHeader";

const BlogLayout: React.FC<{ children: React.ReactNode, id: string }> = ({ children, id }) => {
  
  return (
    <Grid2
      container
      sx={{
        width: "100%",
        maxWidth: "1000px",
        maxHeight: "100vh",
        flexWrap: "nowrap",
      }}
      p={"0px 0"}
      spacing={1}
    >
      <Grid2 size={9}>
        <SideHeader id={id}/>
      </Grid2>
      <Grid2 size={3}>{children}</Grid2>
    </Grid2>
  );
};

export default BlogLayout;
