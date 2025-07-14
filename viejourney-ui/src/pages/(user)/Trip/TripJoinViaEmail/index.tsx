import {
  CalendarMonthOutlined,
  Check,
  DoneAll,
  ErrorOutline,
  Group,
  Login,
  PersonAdd,
  Place,
  VerifiedUser,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { doValidateInvite } from "../../../../services/api";
import { useAuthStore } from "../../../../services/stores/useAuthStore";
import { Account } from "../../../../utils/interfaces";
import dayjs from "dayjs";

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
  const { user, credential, loadCurrentUser } = useAuthStore();
  const [status, setStatus] = useState<JoinStatus>(JoinStatus.VALIDATING);
  const [loading, setLoading] = useState(true);
  const [tripInfo, setTripInfo] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);
  const token = searchParams.get("token");
  // Check if user is already authenticated
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
          setTripInfo(response);
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

  useEffect(() => {
    if (!user && credential?.userId) {
      (async () => {
        await loadCurrentUser();
      })();
    }
    console.log(user);
    console.log(tripInfo);
    if (
      credential?.userId &&
      user?.email == tripInfo?.tripmateExists &&
      status === JoinStatus.TOKEN_VALID
    ) {
      setStatus(JoinStatus.SUCCESS);
      setActiveStep(1);

      enqueueSnackbar("Successfully authenticated! Redirecting to trip...", {
        variant: "success",
      });
    }
  }, [credential, user, status, tripId]);

  // Validate the invitation token
  useEffect(() => {
    if (status === JoinStatus.SUCCESS) {
      setTimeout(() => {
        navigate(`/trips/plan/${tripId}`);
      }, 2000);
    }
  }, [status, tripId]);

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
                  <IconButton
                    color="success"
                    className="bg-green-100 w-fit h-fit p-4 mb-2"
                  >
                    <DoneAll color="success" sx={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography variant="h6" gutterBottom>
                    Invitation Valid!
                  </Typography>

                  <Typography
                    variant="h6"
                    className="mb-2 text-gray-500 text-base"
                  >
                    You've been invited to join
                  </Typography>

                  <Paper
                    elevation={0}
                    className="bg-gray-100 p-2 my-4 rounded-md"
                  >
                    <Typography
                      variant="h5"
                      className="text-start text-base font-bold"
                    >
                      {tripInfo.trip.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        color="text.secondary"
                      >
                        <CalendarMonthOutlined className="text-xl" />
                        <Typography variant="body2">Dates</Typography>
                      </Stack>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        className="text-sm"
                      >
                        {tripInfo.trip.startDate &&
                          dayjs(tripInfo.trip.startDate).format(
                            "MMM D, YYYY"
                          )}{" "}
                        -{" "}
                        {tripInfo.trip.endDate &&
                          dayjs(tripInfo.trip.endDate).format("MMM D, YYYY")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        my: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        color="text.secondary"
                      >
                        <Place className="text-xl" />
                        <Typography variant="body2" color="text.secondary">
                          Destination
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        className="text-sm"
                      >
                        {tripInfo.trip.destination?.name || "Not specified"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        color="text.secondary"
                      >
                        <Group className="text-xl" />
                        <Typography variant="body2" color="text.secondary">
                          Travelers
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        className="text-sm"
                      >
                        {tripInfo.trip.tripmates.length || "Not specified"}{" "}
                        people
                      </Typography>
                    </Box>
                  </Paper>

                  {user ? (
                    // User is already logged in, proceed to success
                    <div className="space-y-2">
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => {
                          setActiveStep(1);
                          setStatus(JoinStatus.SUCCESS);
                        }}
                        className="rounded-sm bg-black hover:bg-black/80 text-white"
                        size="large"
                      >
                        Join Trip
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          window.close();
                        }}
                        className="rounded-sm text-gray-500 border-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        size="large"
                      >
                        Maybe Later
                      </Button>
                    </div>
                  ) : (
                    // User needs to authenticate - redirect to login page
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Button
                        startIcon={<Login />}
                        variant="contained"
                        className="rounded-sm bg-black hover:bg-black/80 text-white"
                        fullWidth
                        onClick={() => navigate("/auth/login")}
                        size="large"
                      >
                        Sign In to Join
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        {(user as unknown as Account)?.email ==
                        tripInfo?.tripmateExists
                          ? "You're already invited to this trip."
                          : "You'll need to sign in or create an account to join this trip."}
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
                  borderRadius: 2,
                }}
              >
                <IconButton
                  color="success"
                  className="bg-green-100 w-fit h-fit p-4 mb-2"
                >
                  <Check sx={{ fontSize: 60 }} />
                </IconButton>
                <Typography variant="h5" gutterBottom fontWeight={500}>
                  Successfully Joined Trip!
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  Redirecting you to the trip page...
                </Typography>
                <CircularProgress size={20} sx={{ mt: 2, color: "inherit" }} />
              </Paper>
              <Link
                to={`/trips/plan/${tripId}`}
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                If not redirected, click here to view the trip
              </Link>
            </Box>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TripJoinViaEmail;
