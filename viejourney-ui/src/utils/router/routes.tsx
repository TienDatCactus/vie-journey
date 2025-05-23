import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Guides from "../../pages/(user)/Guides/Guides";
import Hotels from "../../pages/(user)/Hotels/Hotels";
import { PlanningFormation } from "../../pages/(user)";
import ErrorBoundary from "../handlers/errors/ErrorBoundary";
import Fallback from "../handlers/loading/Fallback";
import ProtectedRoute from "./ProtectedRoute";
import GuideDetail from "../../pages/(user)/Guides/GuideDetail";

// Anonymous routes (no auth required)
const Access = lazy(() => import("../../pages/(anonymous)/Auth/Access"));
const VerifyScreen = lazy(
  () => import("../../pages/(anonymous)/Auth/VerifyEmail")
);

// Protected routes (auth required)
const AuthHome = lazy(() => import("../../pages/(user)/Home/Home"));
const UnAuthHome = lazy(() => import("../../pages/(anonymous)/Home/Home"));
const Dashboard = lazy(() => import("../../pages/(user)/Dashboard/Dashboard"));

// Wrap lazy-loaded components with Suspense
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
    children: [
      {
        path: "",
        element: <SuspenseWrapper component={UnAuthHome} />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute requireAuth={true}>
            <SuspenseWrapper component={AuthHome} />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },

  {
    path: "/auth",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={Access} />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={Access} />
          </ProtectedRoute>
        ),
      },
      {
        path: "verify-email/:token",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={VerifyScreen} />
          </ProtectedRoute>
        ),
      },
    ],
  },
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
      <ProtectedRoute requireAuth={false}>
        <SuspenseWrapper component={Guides} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides/detail",
    element: (
      <ProtectedRoute requireAuth={false}>
        <SuspenseWrapper component={GuideDetail} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/hotels",
    element: (
      <ProtectedRoute requireAuth={false}>
        <SuspenseWrapper component={Hotels} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/trip",
    element: <ProtectedRoute requireAuth={true} />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "create",
        element: <SuspenseWrapper component={PlanningFormation} />,
      },
    ],
  },
]);

export default router;
