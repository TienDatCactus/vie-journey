import {
  Button,
  Divider,
  FormGroup,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { doLoginWithGoogle, doRegister } from "../../services/api";

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
    rePassword: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<{
    email: string;
    password: string;
    rePassword: string;
  }> = async (data) => {
    try {
      setLoading(true);
      await doRegister(data);
    } catch (error) {
      enqueueSnackbar(String(error), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    doLoginWithGoogle();
  };
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="w-full mt-8 p-8 bg-white border-solid border-accent-border border rounded-md shadow-md flex flex-col gap-4 z-10"
    >
      <FormGroup>
        <InputLabel className="font-bold text-sm">Email</InputLabel>
        <OutlinedInput
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
          type="password"
          size="small"
          error={!!errors.password}
          {...register("password", { required: true, minLength: 6 })}
          className="w-full *:text-sm"
          placeholder="Enter your password"
        />
        {errors.password && (
          <FormHelperText error={!!errors.password}>
            This field is required and must be at least 6 characters long
          </FormHelperText>
        )}
      </FormGroup>
      <FormGroup>
        <InputLabel className="font-bold text-sm">Re-enter Password</InputLabel>
        <OutlinedInput
          type="password"
          size="small"
          error={!!errors.rePassword}
          {...register("rePassword", { required: true })}
          className="w-full *:text-sm"
          placeholder="Re-enter your password"
        />
        {errors.rePassword && (
          <FormHelperText error={!!errors.rePassword}>
            This field is required
          </FormHelperText>
        )}
      </FormGroup>

      <div className="my-2">
        <Button
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          disabled={loading}
        >
          Register
        </Button>
      </div>
      <Divider className="text-sm theme-light">Or continue with</Divider>
      <Stack direction={"row"} spacing={2} justifyContent={"center"}>
        <Button
          variant="outlined"
          className="w-full shadow-sm py-2 border-neutral-400 text-center *:text-base"
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
  );
};

export default RegisterForm;
