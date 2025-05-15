import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { LoginForm, RegisterForm } from "../../../components/Auth";

const Access: React.FC = () => {
  const location = useLocation();
  const [path] = useState<string>(location?.pathname);
  const checkPath = () => {
    if (path === "/register") {
      return true;
    }
    return false;
  };
  return (
    <div className="flex flex-col items-center justify-center h-svh">
      <div className=" min-w-[400px]">
        <div className="text-center ">
          <h1 className="m-0">
            {!checkPath()
              ? "Login into your account"
              : "Register for an account"}
          </h1>
          <a href="" className="font-light text-black no-underline">
            Or{" "}
            <a
              href={!checkPath() ? "/register" : "/login"}
              className="text-[#3f61d3] font-medium no-underline"
            >
              {!checkPath() ? "create an account" : "log into your account"}
            </a>
          </a>
        </div>
        {!checkPath() ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default Access;
