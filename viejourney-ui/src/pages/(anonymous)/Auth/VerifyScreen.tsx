import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doVerify } from "../../../services/api";
const VerifyScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await doVerify({ token: token || "" });
        if (resp) {
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  return (
    <div className="h-screen min-w-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      {loading ? (
        <img
          src="/icons/loading-2-svgrepo-com.svg"
          className="animate-spin h-60 w-60 object-cover "
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
