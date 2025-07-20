import { Chip } from "@mui/material";
import { CheckCircle, Schedule, Cancel, Flag } from "@mui/icons-material";

interface BlogStatusChipProps {
  status: string;
}

const BlogStatusChip: React.FC<BlogStatusChipProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return {
          label: "Published",
          color: "success" as const,
          icon: <CheckCircle sx={{ fontSize: "0.75rem" }} />,
        };
      case "PENDING":
        return {
          label: "Pending",
          color: "warning" as const,
          icon: <Schedule sx={{ fontSize: "0.75rem" }} />,
        };
      case "REJECTED":
        return {
          label: "Rejected",
          color: "error" as const,
          icon: <Cancel sx={{ fontSize: "0.75rem" }} />,
        };
      case "FLAGGED":
        return {
          label: "Flagged",
          color: "error" as const,
          icon: <Flag sx={{ fontSize: "0.75rem" }} />,
        };
      default:
        return {
          label: "Draft",
          color: "default" as const,
          icon: <Schedule sx={{ fontSize: "0.75rem" }} />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size="small"
      sx={{
        fontSize: "0.75rem",
        height: 24,
      }}
    />
  );
};

export default BlogStatusChip;
