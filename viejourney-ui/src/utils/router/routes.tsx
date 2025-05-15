import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ErrorBoundary from "../handlers/errors/ErrorBoundary";
import Guides from "../../pages/(user)/Guides/Guides";
import Hotels from "../../pages/(user)/Hotels/Hotels";
import { PlanningFormation } from "../../pages/(user)/Trip";
const Access = lazy(() => import("../../pages/(anonymous)/Auth/Access"));
const Home = lazy(() => import("../../pages/(user)/Home/Home"));
const Dashboard = lazy(() => import("../../pages/(user)/Dashboard/Dashboard"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/auth",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "login",
        element: <Access />,
      },
      {
        path: "register",
        element: <Access />,
      },
      {
        path: "verify-email",
        element: <Access />,
      },
    ],
  },

  {
    path: "/profile",
    element: <Dashboard />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides",
    element: <Guides />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/hotels",
    element: <Hotels />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/plan",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "create",
        element: <PlanningFormation />,
      },
    ],
  },
]);

export default router;
