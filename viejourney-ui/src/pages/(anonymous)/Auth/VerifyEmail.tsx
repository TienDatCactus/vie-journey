import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doVerify } from "../../../services/api";
const VerifyScreen: React.FC = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(false);
  const navigate = useNavigate();
  console.log(token);
  useEffect(() => {
    // Fix: Don't use return function for the main effect logic
    // This was causing the verification to run on unmount instead of on mount
    (async () => {
      try {
        setLoading(true);
        const resp = await doVerify(
          { token: token || "" },
          setError,
          setLoading
        );
        if (resp?.status == 200) {
          setLoading(false);
          setTimeout(() => {
            navigate("/auth/login");
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [token, navigate]);
  return (
    <div className="h-screen min-w-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      {loading ? (
        <img
          src="/icons/loading-2-svgrepo-com.svg"
          className="animate-spin h-60 w-60 object-cover "
        />
      ) : err ? (
        <img
          src="/icons/error-svgrepo-com.svg"
          className="h-50 w-50 object-cover "
        />
      ) : (
        <img
          src="/icons/tick-2-svgrepo-com.svg"
          className="h-50 w-50 object-cover "
        />
      )}
      <div className="my-4 ">
        {loading ? (
          <h1 className="text-2xl ">Verifying ...</h1>
        ) : err ? (
          <div className="flex flex-col items-center ">
            <h1 className="text-2xl">Verification Failed!</h1>
            <p className="text-2xl">
              Your email could not be verified. Please try again.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center ">
            <h1 className="text-2xl">Congratulations!</h1>
            <p className="text-2xl">
              Your email has been verified successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyScreen;
