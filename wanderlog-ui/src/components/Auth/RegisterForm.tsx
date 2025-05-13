import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import XIcon from "@mui/icons-material/X";
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
import { useNavigate } from "react-router-dom";
import { doRegister } from "../../services/api";
const loginMets: Array<{
  icon: React.ReactNode;
}> = [
  {
    icon: <FacebookIcon />,
  },
  {
    icon: <XIcon />,
  },
  {
    icon: <GoogleIcon />,
  },
];
const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
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
      const registerAttempt = await doRegister(data);
      if (registerAttempt) {
        setTimeout(() => {
          navigate(`/login`);
        }, 1000);
      }
    } catch (error) {
      enqueueSnackbar(String(error), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="w-full mt-8 p-8 bg-white border-solid border-[#ccc] border rounded-md shadow-md flex flex-col gap-2"
    >
      <FormGroup>
        <InputLabel className="font-bold text-[14px]">Email</InputLabel>
        <OutlinedInput
          className="w-full *:text-[14px]"
          error={!!errors.email}
          size="small"
          placeholder="Enter your email address"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <FormHelperText error={!!errors.email}>
            {" "}
            This field is required
          </FormHelperText>
        )}
      </FormGroup>
      <FormGroup>
        <InputLabel className="font-bold text-[14px]">Password</InputLabel>
        <OutlinedInput
          type="password"
          size="small"
          error={!!errors.password}
          {...register("password", { required: true })}
          className="w-full *:text-[14px]"
          placeholder="Enter your password"
        />
        {errors.password && (
          <FormHelperText error={!!errors.password}>
            This field is required
          </FormHelperText>
        )}
      </FormGroup>
      <FormGroup>
        <InputLabel className="font-bold text-[14px]">
          Re-enter Password
        </InputLabel>
        <OutlinedInput
          type="password"
          size="small"
          error={!!errors.rePassword}
          {...register("rePassword", { required: true })}
          className="w-full *:text-[14px]"
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
          Login
        </Button>
      </div>
      <Divider className="text-[12px] text-[#5b5b5b]">Or continue with</Divider>
      <Stack direction={"row"} spacing={2} justifyContent={"center"}>
        {!!loginMets.length &&
          loginMets?.map((loginMet, index) => (
            <Button
              key={index}
              className="w-full py-3 text-center border-solid border-[#ccc] border rounded-md text-[#30373f] *:text-[16px]"
            >
              {loginMet.icon}
            </Button>
          ))}
      </Stack>
    </form>
  );
};

export default RegisterForm;
