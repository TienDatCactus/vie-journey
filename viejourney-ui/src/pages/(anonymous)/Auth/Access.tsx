import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { LoginForm, RegisterForm } from "../../../components/Auth";
import { useAuthStore } from "../../../services/stores/useAuthStore";

const Access: React.FC = () => {
  const { user, info } = useAuthStore();
  const [tab, setTab] = useState("");
  if (user || info) {
    return <Navigate to="/" replace />;
  }

  const checkTab = () => {
    switch (tab) {
      case "login":
        return {
          form: <LoginForm />,
          title: "Login into your account",
          link: "register",
          subTitle: "create an account",
        };
      case "register":
        return {
          form: <RegisterForm />,
          title: "Register for an account",
          link: "login",
          subTitle: "log into your account",
        };
      default:
        return {
          form: <LoginForm />,
          title: "Login into your account",
          link: "register",
          subTitle: "create an account",
        };
    }
  };
  console.log(tab);
  return (
    <div className="relative flex flex-col items-center justify-center  w-full bg-[#f8fafc] h-svh">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] "></div>
      <div className=" min-w-100 z-20">
        <div className="text-center ">
          <h1 className="m-0 text-3xl my-2 font-bold text-black no-underline">
            {checkTab()?.title}
          </h1>
          <span className="font-light text-black no-underline">
            Or{" "}
            <a
              onClick={() => setTab(checkTab()?.link)}
              className="text-primary-600 font-medium hover:underline no-underline cursor-pointer"
            >
              {checkTab()?.subTitle}
            </a>{" "}
            Or{" "}
            <Link
              to="/"
              className="text-primary-600 font-medium hover:underline no-underline"
            >
              go home
            </Link>
          </span>
        </div>
        {checkTab()?.form}
      </div>
    </div>
  );
};

export default Access;
