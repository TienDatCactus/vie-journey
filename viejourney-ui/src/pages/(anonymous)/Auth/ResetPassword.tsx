import {
  Alert,
  Button,
  CircularProgress,
  LinearProgress,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doForgotPassword } from "../../../services/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { Send } from "@mui/icons-material";
const ResetPassword: React.FC = () => {
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
  const [timer, setTimer] = useState<number>(5);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    password: string;
  }>();
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const onSubmit: SubmitHandler<{ password: string }> = async (data) => {
    try {
      setCurrentState((prev) => ({ ...prev, loading: true }));
      const resp = await doForgotPassword(token || "", data.password);
      if (resp == true) {
        setCurrentState((prev) => ({ ...prev, success: true }));
        setDisableForm(true);
        setTimeout(() => {
          navigate("/auth/login");
        }, timer * 1000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCurrentState((prev) => ({ ...prev, loading: false }));
    }
  };
  useEffect(() => {
    if (currentState.success) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [currentState.success]);
  return (
    <div className="relative flex flex-col items-center justify-center  w-full bg-[#f8fafc] h-svh">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] "></div>
      <div className="bg-white z-20 p-6 shadow-lg min-w-[31.25rem]">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center mb-4">
            <h1 className="m-0 text-3xl my-2 font-bold text-black no-underline">
              Reset Password
            </h1>
            <span className="font-light text-black no-underline">
              Please enter your new password.
            </span>
          </div>
          {currentState.loading && <LinearProgress />}
          {currentState.err && (
            <Alert severity="error" className="mb-4">
              An error occurred while resetting your password.
            </Alert>
          )}
          {currentState.success && (
            <Alert severity="success" className="mb-4">
              Password reset successfully!
            </Alert>
          )}
          <TextField
            required
            disabled={disableForm}
            fullWidth
            type="password"
            label="New Password"
            autoComplete="new-password"
            variant="outlined"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <Alert severity="error" className="mb-4">
              {errors.password.message}
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full"
            endIcon={<Send />}
            variant="contained"
            disabled={currentState.loading || disableForm}
          >
            {currentState.loading ? (
              <CircularProgress size={24} />
            ) : (
              "Reset Password"
            )}
          </Button>
          {currentState.success && (
            <p className="text-sm text-neutral-600 mt-4">
              You will be redirected to the login page in {timer} seconds...
            </p>
          )}
        </form>
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

export default ResetPassword;
