import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Accounts from "../../pages/(admin)/Accounts";
import AccountDetail from "../../pages/(admin)/Accounts/AccountDetail";
import HotelManagement from "../../pages/(admin)/Hotel";
import RoleManagement from "../../pages/(admin)/RoleManagement";
import BlogList from "../../pages/(manager)/Blog/BlogList";
import BlogDetail from "../../pages/(user)/Guides/BlogDetail";
import ErrorBoundary from "../handlers/errors/ErrorBoundary";
import Fallback from "../handlers/loading/Fallback";
import ProtectedRoute from "./ProtectedRoute";

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
const Hotels = lazy(() => import("../../pages/(user)/Hotels/Hotels"));
const CreateTrip = lazy(() => import("../../pages/(user)/Trip/CreateTrip"));

const CreateTripDetails = lazy(
  () => import("../../pages/(user)/Trip/CreateTripDetails/CreateTripDetails")
);
const OauthSuccess = lazy(
  () => import("./../../pages/(anonymous)/Auth/OauthSuccess")
);
const Media = lazy(() => import("../../pages/(admin)/Media"));
const Blog = lazy(() => import("../../pages/(manager)/Blog/BlogList"));
const BlogView = lazy(() => import("../../pages/(manager)/Blog/BlogView"));

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
      <ProtectedRoute requireAuth={false}>
        <SuspenseWrapper component={Dashboard} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/blogs",
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={BlogList} />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />,
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={BlogDetail} />
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
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute requireAuth={false}>
                <SuspenseWrapper component={Accounts} />
              </ProtectedRoute>
            ),
          },
          {
            path: "detail/:id",
            element: (
              <ProtectedRoute requireAuth={false}>
                <SuspenseWrapper component={AccountDetail} />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "hotels",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={HotelManagement} />
          </ProtectedRoute>
        ),
      },
      {
        path: "role-management",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={RoleManagement} />
          </ProtectedRoute>
        ),
      },
      {
        path: "media",
        errorElement: <ErrorBoundary />,
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={Media} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/trip",
    // element: <ProtectedRoute requireAuth={false} />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "create",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute requireAuth={false}>
                <SuspenseWrapper component={CreateTrip} />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={CreateTripDetails} />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/manager",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "blog",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SuspenseWrapper component={Blog} />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ":id",
            element: (
              <ProtectedRoute requireAuth={false}>
                <SuspenseWrapper component={BlogView} />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/blog",
    errorElement: <ErrorBoundary />,
    children: [],
  },
]);

export default router;
