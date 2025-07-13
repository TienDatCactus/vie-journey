import {
  Check,
  ErrorOutline,
  Login,
  PersonAdd,
  VerifiedUser,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { doValidateInvite } from "../../../../services/api";
import { useAuthStore } from "../../../../services/stores/useAuthStore";

enum JoinStatus {
  VALIDATING = "validating",
  INVALID_TOKEN = "invalid_token",
  TOKEN_VALID = "token_valid",
  SUCCESS = "success",
  ERROR = "error",
}

const TripJoinViaEmail: React.FC = () => {
  const { tripId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, credential } = useAuthStore();
  const [status, setStatus] = useState<JoinStatus>(JoinStatus.VALIDATING);
  const [loading, setLoading] = useState(true);
  const [tripInfo, setTripInfo] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);

  const token = searchParams.get("token");

  // Check if user is already authenticated
  useEffect(() => {
    if (credential?.userId && user && status === JoinStatus.TOKEN_VALID) {
      setStatus(JoinStatus.SUCCESS);
      setActiveStep(1);

      enqueueSnackbar("Successfully authenticated! Redirecting to trip...", {
        variant: "success",
      });

      setTimeout(() => {
        navigate(`/trips/plan/${tripId}`);
      }, 2000);
    }
  }, [credential, user, status, tripId, navigate]);

  // Validate the invitation token
  useEffect(() => {
    const validateInviteToken = async () => {
      if (!tripId || !token) {
        setStatus(JoinStatus.INVALID_TOKEN);
        setLoading(false);
        return;
      }

      try {
        const response = await doValidateInvite(tripId, token);
        if (response) {
          setTripInfo(response.trip);
        }

        // Set token valid status
        setStatus(JoinStatus.TOKEN_VALID);

        // If user is already authenticated, they'll be redirected by the auth effect
      } catch (error) {
        console.error("Error validating invite token:", error);
        setStatus(JoinStatus.INVALID_TOKEN);
      } finally {
        setLoading(false);
      }
    };

    validateInviteToken();
  }, [tripId, token]);

  // Steps for the stepper
  const steps = [
    {
      label: "Validate Invitation",
      icon: <VerifiedUser />,
      description: "Checking your invitation link",
    },
    {
      label: "Join Trip",
      icon: <PersonAdd />,
      description: "Join the trip and view details",
    },
  ];

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <img
        src="/images/carrizo-plain-national-monument-in-california-yd.jpg"
        alt="Background"
        className="fixed w-full h-screen object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full mx-4 rounded-xl">
          <Box className="mb-4">
            <Typography variant="h5" className="font-semibold text-center">
              Trip Invitation
            </Typography>
          </Box>

          {/* Simplified Stepper - Only 2 steps now */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel nonLinear={false}>
              {steps.map((step, index) => (
                <Step key={step.label} completed={index < activeStep}>
                  <StepLabel
                    error={
                      (index === 0 && status === JoinStatus.INVALID_TOKEN) ||
                      (index === 1 && status === JoinStatus.ERROR)
                    }
                  >
                    {step.label}
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 0.5, color: "text.secondary" }}
                    >
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Content based on status */}
          {loading ? (
            <Box className="flex flex-col items-center justify-center py-8">
              <CircularProgress size={40} className="mb-4" />
              <Typography>Validating your invitation...</Typography>
            </Box>
          ) : status === JoinStatus.INVALID_TOKEN ? (
            <Box className="text-center py-8">
              <Paper
                elevation={0}
                className="bg-red-500 text-white"
                sx={{
                  p: 3,
                  borderRadius: 1,
                }}
              >
                <ErrorOutline sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom fontWeight={500}>
                  Invalid or Expired Invitation
                </Typography>
                <Typography>
                  This invitation link is invalid or has expired. Please ask the
                  trip owner to send a new invitation.
                </Typography>
              </Paper>

              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ mt: 4 }}
              >
                Go to Home
              </Button>
            </Box>
          ) : status === JoinStatus.TOKEN_VALID ? (
            // Validation Success - Offer to continue to login
            <Box className="py-4">
              {tripInfo && (
                <Box className="text-center">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: "success.light",
                      color: "success.contrastText",
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Check sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Invitation Valid!
                    </Typography>
                  </Paper>

                  <Typography variant="h6" className="mb-2">
                    You've been invited to join
                  </Typography>
                  <Typography variant="h5" className="font-bold mb-4">
                    {tripInfo.name}
                  </Typography>

                  <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Dates
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {tripInfo.startDate &&
                          new Date(
                            tripInfo.startDate
                          ).toLocaleDateString()}{" "}
                        -{" "}
                        {tripInfo.endDate &&
                          new Date(tripInfo.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Destination
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {tripInfo.destination?.name || "Not specified"}
                      </Typography>
                    </Box>
                  </Paper>

                  {user ? (
                    // User is already logged in, proceed to success
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        setActiveStep(1);
                        setStatus(JoinStatus.SUCCESS);
                      }}
                      size="large"
                    >
                      Join Trip
                    </Button>
                  ) : (
                    // User needs to authenticate - redirect to login page
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Button
                        startIcon={<Login />}
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate("/auth/login")}
                        size="large"
                      >
                        Sign In to Join
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        You'll need to sign in or create an account to join this
                        trip.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            // Success - Already handled by redirect
            <Box className="py-4 text-center">
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "success.light",
                  color: "success.contrastText",
                  borderRadius: 2,
                }}
              >
                <Check sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight={500}>
                  Successfully Joined Trip!
                </Typography>
                <Typography variant="body1">
                  Redirecting you to the trip page...
                </Typography>
                <CircularProgress size={20} sx={{ mt: 2, color: "inherit" }} />
              </Paper>
            </Box>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TripJoinViaEmail;
