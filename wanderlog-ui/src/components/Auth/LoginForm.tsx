import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import XIcon from "@mui/icons-material/X";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid2,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { doLogin } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
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
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    try {
      setLoading(true);
      const loginAttempt = await doLogin(data);
      if (loginAttempt) {
        navigate("/");
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
        <Grid2 container justifyContent={"space-between"} alignItems={"center"}>
          <FormControlLabel
            control={<Checkbox />}
            label="Remember me"
            className="*:text-[14px]"
          />
          <a
            href=""
            className="text-[14px] no-underline text-[#3861b0] font-medium"
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

export default LoginForm;
