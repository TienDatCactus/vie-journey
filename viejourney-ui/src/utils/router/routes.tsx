import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorBoundary from "../handlers/errors/ErrorBoundary";
import Guides from "../../pages/(user)/Guides/Guides";
import Hotels from "../../pages/(user)/Hotels/Hotels";
import { PlanningFormation } from "../../pages/(user)/Trip";
import Fallback from "../handlers/loading/Fallback";
import ProtectedRoute from "./ProtectedRoute";

// Anonymous routes (no auth required)
const Access = lazy(() => import("../../pages/(anonymous)/Auth/Access"));
const VerifyScreen = lazy(
  () => import("../../pages/(anonymous)/Auth/VerifyScreen")
);

// Protected routes (auth required)
const Home = lazy(() => import("../../pages/(user)/Home/Home"));
const Dashboard = lazy(() => import("../../pages/(user)/Dashboard/Dashboard"));
// Wrap lazy-loaded components wimport VerifyScreen from './../../pages/(anonymous)/Auth/VerifyScreen';
const SuspenseWrapper = ({
  component: Component,
}: {
  component: React.ComponentType<any>;
}) => (
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute requireAuth={true}>
        <SuspenseWrapper component={Home} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/auth",
    element: <ProtectedRoute requireAuth={false} />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: <SuspenseWrapper component={Access} />,
      },
      {
        path: "register",
        element: <SuspenseWrapper component={Access} />,
      },
      {
        path: "verify-email",
        element: <SuspenseWrapper component={VerifyScreen} />,
      },
    ],
  },
  // Protected routes
  {
    path: "/profile",
    element: (
      <ProtectedRoute requireAuth={true}>
        <SuspenseWrapper component={Dashboard} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides",
    element: (
      <ProtectedRoute requireAuth={true}>
        <Guides />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/hotels",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Hotels />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/plan",
    element: <ProtectedRoute requireAuth={true} />,
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
