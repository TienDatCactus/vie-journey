"use client";
import { Add as AddIcon, Public as PublicIcon } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function TravelGuides() {
  const [guides, setGuides] = useState<any[]>([]);

  const handleCreateGuide = () => {
    console.log("Creating new guide...");
  };

  const handleCreateFirstGuide = () => {
    console.log("Creating first guide...");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "1000px",
        backgroundColor: "#fafafa",
        py: 4,
      }}
    >
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 6,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#1a1a1a",
                mb: 1,
              }}
            >
              Travel Guides
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                fontSize: "16px",
              }}
            >
              Share your travel knowledge
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateGuide}
            sx={{
              backgroundColor: "#2c2c2c",
              "&:hover": {
                backgroundColor: "#1a1a1a",
              },
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            Create Guide
          </Button>
        </Box>

        {guides.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                mb: 3,
                p: 3,
                borderRadius: "50%",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PublicIcon
                sx={{
                  fontSize: 60,
                  color: "#bbb",
                  strokeWidth: 1,
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#333",
                mb: 2,
              }}
            >
              No guides yet
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 4,
                maxWidth: "400px",
                lineHeight: 1.6,
              }}
            >
              Start sharing your travel experiences by creating your first guide
            </Typography>

            <Button
              variant="contained"
              onClick={handleCreateFirstGuide}
              sx={{
                backgroundColor: "#2c2c2c",
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                },
                textTransform: "none",
                fontWeight: 500,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "16px",
              }}
            >
              Create Your First Guide
            </Button>
          </Box>
        )}

        {guides.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1">
              Your travel guides will appear here...
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
}
