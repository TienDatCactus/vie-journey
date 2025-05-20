import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { LoginForm, RegisterForm } from "../../../components/Auth";

const Access: React.FC = () => {
  const location = useLocation();
  const [path] = useState<string>(location?.pathname);
  const checkPath = () => {
    switch (path) {
      case "/auth/login":
        return {
          form: <LoginForm />,
          title: "Login into your account",
          link: "/auth/register",
          subTitle: "create an account",
        };
      case "/auth/register":
        return {
          form: <RegisterForm />,
          title: "Register for an account",
          link: "/auth/login",
          subTitle: "log into your account",
        };
      default:
        return {
          form: <LoginForm />,
          title: "Login into your account",
          link: "/auth/register",
          subTitle: "create an account",
        };
    }
  };
  return (
    <div className="relative flex flex-col items-center justify-center  w-full bg-[#f8fafc] h-svh">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] "></div>
      <div className=" min-w-[400px] z-20">
        <div className="text-center ">
          <h1 className="m-0 text-3xl my-2 font-bold text-black no-underline">
            {checkPath()?.title}
          </h1>
          <span className="font-light text-black no-underline">
            Or{" "}
            <a
              href={checkPath()?.link}
              className="text-[#3f61d3] font-medium hover:underline no-underline"
            >
              {checkPath()?.subTitle}
            </a>{" "}
            Or{" "}
            <a
              href="/"
              className="text-[#3f61d3] font-medium hover:underline no-underline"
            >
              go home
            </a>
          </span>
        </div>
        {checkPath()?.form}
      </div>
    </div>
  );
};

export default Access;
