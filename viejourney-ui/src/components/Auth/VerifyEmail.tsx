import {
  Button,
  FormGroup,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { doVerify } from "../../services/api";

const VerifyEmail: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    otp: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<{ otp: string }> = async (data) => {
    try {
      setLoading(true);
      await doVerify({ otp: data.otp });
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
      className="w-full mt-8 p-8 bg-white border-solid border-[#ccc] border rounded-md shadow-md flex flex-col gap-4"
    >
      <FormGroup>
        <InputLabel className="font-bold text-sm">OTP</InputLabel>
        <OutlinedInput
          className="w-full *:text-sm"
          error={!!errors.otp}
          size="small"
          placeholder="Enter your otp"
          {...register("otp", { required: true })}
        />
        {errors.otp && (
          <FormHelperText error={!!errors.otp}>
            {" "}
            This field is required
          </FormHelperText>
        )}
      </FormGroup>

      <div>
        <Button
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          disabled={loading}
        >
          Verify
        </Button>
      </div>
    </form>
  );
};

export default VerifyEmail;
