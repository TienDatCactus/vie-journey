import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorBoundary from "../handlers/errors/ErrorBoundary";
import Fallback from "../handlers/loading/Fallback";
import ProtectedRoute from "./ProtectedRoute";
import GuideDetail from "../../pages/(user)/Guides/GuideDetail";
import Accounts from "../../pages/(admin)/Accounts";

// Anonymous routes (no auth required)
const Access = lazy(() => import("../../pages/(anonymous)/Auth/Access"));
const VerifyScreen = lazy(
  () => import("../../pages/(anonymous)/Auth/VerifyEmail")
);
const ResetPassword = lazy(
  () => import("../../pages/(anonymous)/Auth/ResetPassword")
);
const UnAuthHome = lazy(() => import("../../pages/(anonymous)/Home/Home"));

// Protected routes (auth required)
const AuthHome = lazy(() => import("../../pages/(user)/Home/Home"));
const Dashboard = lazy(() => import("../../pages/(user)/Dashboard/Dashboard"));
const Admin = lazy(() => import("../../pages/(admin)/Dashboard/index"));
const Guides = lazy(() => import("../../pages/(user)/Guides/Guides"));
const Hotels = lazy(() => import("../../pages/(user)/Hotels/Hotels"));
const CreateTrip = lazy(() => import("../../pages/(user)/Trip/CreateTrip"));
const CreateTripDetails = lazy(
  () => import("../../pages/(user)/Trip/CreateTripDetails/CreateTripDetails")
);
const OauthSuccess = lazy(
  () => import("./../../pages/(anonymous)/Auth/OauthSuccess")
);

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
      {
        path: "reset-password/:token",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={ResetPassword} />
          </ProtectedRoute>
        ),
      },
      {
        path: "oauth-success",
        element: <SuspenseWrapper component={OauthSuccess} />,
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
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={Guides} />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />,
      },
      {
        path: "detail",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={GuideDetail} />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />,
      },
    ],
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
    path: "/admin",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={Admin} />
          </ProtectedRoute>
        ),
      },
      {
        path: "accounts",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={Accounts} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/trip",
    element: <ProtectedRoute requireAuth={true} />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "create",
        children: [
          {
            path: "",
            element: <SuspenseWrapper component={CreateTrip} />,
          },
          {
            path: ":tripId",
            element: <SuspenseWrapper component={CreateTripDetails} />,
          },
        ],
      },
    ],
  },
]);

export default router;
