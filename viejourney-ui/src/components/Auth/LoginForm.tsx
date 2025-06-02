import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid2,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  doLogin,
  doLoginWithGoogle,
  doSendForgotPasswordEmail,
} from "../../services/api";
import { LoginRespDTO } from "../../services/api/dto";
import { useAuth } from "../../services/stores";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>();
  const { setCredential } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlefpFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const email = formJson.email;
      const resp = await doSendForgotPasswordEmail(email);
      if (resp == true) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    doLoginWithGoogle();
  };
  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    try {
      setLoading(true);
      const loginResp = (await doLogin(data)) as LoginRespDTO | undefined;
      if (loginResp && loginResp?.accessToken) {
        setCredential({ userId: loginResp?.userId || "" });
        navigate("/");
      }
    } catch (error) {
      enqueueSnackbar(String(error), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-8 p-8 bg-white border-solid border-accent-border border rounded-md shadow-md flex flex-col gap-4"
      >
        <FormGroup>
          <InputLabel className="font-bold text-sm">Email</InputLabel>
          <OutlinedInput
            disabled={loading}
            className="w-full *:text-sm"
            error={!!errors.email}
            size="small"
            placeholder="Enter your email address"
            {...register("email", {
              required: true,
              validate: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) || "Invalid email address";
              },
            })}
            type="email"
            autoComplete="email"
          />
          {errors.email && (
            <FormHelperText error={!!errors.email}>
              This field is required and must be a valid email address
            </FormHelperText>
          )}
        </FormGroup>
        <FormGroup>
          <InputLabel className="font-bold text-sm">Password</InputLabel>
          <OutlinedInput
            disabled={loading}
            type="password"
            size="small"
            error={!!errors.password}
            {...register("password", { required: true, minLength: 6 })}
            className="w-full *:text-sm"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {errors.password && (
            <FormHelperText error={!!errors.password}>
              This field is required and must be at least 6 characters long
            </FormHelperText>
          )}
        </FormGroup>
        <FormGroup>
          <Grid2
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
              className="*:text-sm"
            />
            <a
              onClick={handleClickOpen}
              className="text-sm no-underline text-primary-600 font-medium hover:underline"
            >
              Forgot your password ?
            </a>
          </Grid2>
        </FormGroup>
        <div>
          <Button
            fullWidth
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading}
          >
            Login
          </Button>
        </div>
        <Divider className="text-sm theme-light">Or continue with</Divider>
        <Stack direction={"row"} spacing={2} justifyContent={"center"}>
          <Button
            variant="outlined"
            className="w-full hover:shadow-lg py-2 border-neutral-300 text-center *:text-base"
            onClick={handleGoogleLogin}
          >
            <img
              src="/icons/icons8-google.svg"
              alt="Google"
              className="w-6 h-6 "
            />
          </Button>
        </Stack>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: handlefpFormSubmit,
          },
        }}
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, please enter your email address here. We
            will send you a link to reset your password.
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Reset Password</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginForm;
