import {
  ArrowForward,
  CancelOutlined,
  DoneAllOutlined,
  Email,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doResendVerificationEmail, doVerify } from "../../../services/api";
const VerifyScreen: React.FC = () => {
  const { token } = useParams();
  const [currentState, setCurrentState] = useState<{
    loading: boolean;
    err: boolean;
    success: boolean;
  }>({
    loading: false,
    err: false,
    success: false,
  });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(5);
  const [open, setOpen] = React.useState(false);

  const handleFormOpen = () => {
    setOpen(true);
  };

  const handleFormClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const email = formJson.email;
      const resp = await doResendVerificationEmail(email);
      if (resp == true) {
        enqueueSnackbar("Verification email sent successfully", {
          variant: "success",
        });
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  console.log(token);
  useEffect(() => {
    (async () => {
      try {
        setCurrentState({ ...currentState, loading: true });
        const resp = await doVerify({ token: token || "" }, setCurrentState);
        if (resp?.status == 200) {
          setCurrentState({ ...currentState, loading: false, success: true });
          setTimeout(() => {
            navigate("/auth/login");
            setTimer(timer - 1);
          }, 5000);
        }
      } catch (error) {
        setCurrentState({ ...currentState, loading: false, err: true });
      }
    })();
  }, [token, navigate]);

  const stateCheck = () => {
    if (currentState?.loading) {
      return (
        <Stack direction={"column"} spacing={2} className="text-center">
          <CircularProgress
            className="text-[#3f61d3] m-auto"
            size={50}
            thickness={5}
          />
          <div>
            <h1 className="font-bold text-3xl">Verifying Your Email</h1>
            <p className="text-neutral-800 no-underline">
              Please wait while we verify your email address...
            </p>
          </div>
          <LinearProgress
            value={currentState.loading ? 100 : 0}
            className="h-2 rounded-full"
          />
          <p className="text-sm text-neutral-600">
            This may take a few moments ...
          </p>
        </Stack>
      );
    } else if (currentState?.err) {
      return (
        <Stack direction={"column"} spacing={2} className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-fit mx-auto">
            <CancelOutlined className="text-red-500 text-4xl " />
          </div>
          <div>
            <h1 className="font-bold text-3xl">Verification Failed</h1>
            <p className="text-neutral-800 no-underline">
              We couldn't verify your email address. Please try again.
            </p>
          </div>
          <Alert severity="error">
            The verification link is invalid or has already been used.
          </Alert>
          <Stack direction={"column"} gap={1}>
            <Button
              variant="contained"
              key={"email"}
              startIcon={<Email />}
              onClick={handleFormOpen}
            >
              Resend Verification Email
            </Button>
            <Button
              key={"login"}
              variant="outlined"
              onClick={() => navigate("/auth/login")}
              className="text-[#3f61d3]"
            >
              Return to Login
            </Button>
          </Stack>
          <Dialog
            open={open}
            onClose={handleFormClose}
            slotProps={{
              paper: {
                component: "form",
                onSubmit: handleFormSubmit,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={50} />
            ) : (
              <>
                <DialogTitle>Send a verification Email</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To resend the verification email, please enter your email
                    address below. We will send you a new verification link.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleFormClose}>Cancel</Button>
                  <Button type="submit">Send</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Stack>
      );
    } else if (currentState?.success) {
      return (
        <Stack direction={"column"} spacing={2} className="text-center">
          <div className="bg-green-100 rounded-full p-4 w-fit mx-auto">
            <DoneAllOutlined className="text-4xl text-green-600" />
          </div>
          <div>
            <h1 className="font-bold text-3xl">Email Verified!</h1>
            <p className="text-neutral-800 no-underline">
              Your email has been successfully verified. Welcome aboard!
            </p>
          </div>
          <Alert severity="success">
            Your account is now active and ready to use.
          </Alert>
          <p className="text-sm text-neutral-600">
            Redirecting to login in {timer} seconds...
          </p>
          <Button endIcon={<ArrowForward />} variant="contained">
            Continue to Home
          </Button>
        </Stack>
      );
    }
  };
  return (
    <div className="relative flex flex-col items-center justify-center  w-full bg-[#f8fafc] h-svh">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] "></div>
      <div className="bg-white z-20 p-6 shadow-lg min-w-[31.25rem]">
        {stateCheck()}
      </div>
      <div className="my-4  z-20">
        <span>Need help?</span>
        <a
          href=""
          className="text-primary-700 font-semibold hover:underline ms-1"
        >
          Contact support
        </a>
      </div>
    </div>
  );
};

export default VerifyScreen;
