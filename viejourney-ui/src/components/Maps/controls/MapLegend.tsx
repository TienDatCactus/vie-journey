import React from "react";
import {
  Paper,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Place as PlaceIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  LocalActivity as ActivityIcon,
  DirectionsCar as CarIcon,
  DirectionsBus as BusIcon,
  DirectionsWalk as WalkIcon,
} from "@mui/icons-material";

export interface LegendItem {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  count?: number;
}

interface MapLegendProps {
  title?: string;
  categories?: LegendItem[];
  transportation?: LegendItem[];
  onCategoryToggle?: (id: string) => void;
  activeCategoryIds?: string[];
}

const MapLegend: React.FC<MapLegendProps> = ({
  title = "Map Legend",
  categories = [],
  transportation = [],
  onCategoryToggle,
  activeCategoryIds = [],
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleCategoryClick = (id: string) => {
    if (onCategoryToggle) {
      onCategoryToggle(id);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        width: 250,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "white",
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={toggleExpanded}
          sx={{ color: "white" }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto">
        {/* Categories */}
        {categories.length > 0 && (
          <>
            <List sx={{ py: 0 }}>
              {categories.map((category) => {
                const isActive = activeCategoryIds?.includes(category.id);
                return (
                  <ListItem
                    key={category.id}
                    component="div"
                    dense
                    onClick={() => handleCategoryClick(category.id)}
                    sx={{
                      bgcolor: isActive ? `${category.color}10` : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: category.color }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={category.label}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: isActive ? 500 : 400,
                      }}
                    />
                    {category.count !== undefined && (
                      <Box
                        sx={{
                          bgcolor: isActive ? category.color : "grey.200",
                          color: isActive ? "white" : "text.secondary",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                        }}
                      >
                        {category.count}
                      </Box>
                    )}
                  </ListItem>
                );
              })}
            </List>

            {transportation.length > 0 && <Divider />}
          </>
        )}

        {/* Transportation */}
        {transportation.length > 0 && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              TRANSPORTATION
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {transportation.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 1,
                    bgcolor: `${item.color}10`,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ color: item.color, display: "flex", mr: 0.5 }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="caption">{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
};

export default MapLegend;
