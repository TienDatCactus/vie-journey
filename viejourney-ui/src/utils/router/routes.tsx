import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AuthLayout } from "../../layouts";
import ErrorBoundary from "../handlers/errors/ErrorBoundary";
import Fallback from "../handlers/loading/Fallback";
import ProtectedRoute from "./ProtectedRoute";
import InviteRedirect from "../../pages/(user)/Trip/TripInvite";
import TripJoinViaEmail from "../../pages/(user)/Trip/TripJoinViaEmail";
import Media from "../../pages/(manager)/Media";
// Anonymous routes
const Access = lazy(() => import("../../pages/(anonymous)/Auth/Access"));
const VerifyScreen = lazy(
  () => import("../../pages/(anonymous)/Auth/VerifyEmail")
);
const ResetPassword = lazy(
  () => import("../../pages/(anonymous)/Auth/ResetPassword")
);
const UnAuthHome = lazy(() => import("../../pages/(anonymous)/Home/Home"));
const OauthSuccess = lazy(
  () => import("../../pages/(anonymous)/Auth/OauthSuccess")
);

// User routes
const AuthHome = lazy(() => import("../../pages/(user)/Home/Home"));
const Dashboard = lazy(() => import("../../pages/(user)/Dashboard/Dashboard"));
const Hotels = lazy(() => import("../../pages/(user)/Hotels/Hotels"));
const CreateTrip = lazy(() => import("../../pages/(user)/Trip/CreateTrip"));
const CreateTripDetails = lazy(
  () => import("../../pages/(user)/Trip/CreateTripDetails")
);
const BlogList = lazy(() => import("../../pages/(user)/Blogs/BlogList"));
const BlogDetail = lazy(
  () => import("../../pages/(user)/Blogs/BlogDetail/BlogDetail")
);
const CreateBlog = lazy(
  () => import("../../pages/(user)/Blogs/CreateBlog/CreateBlog")
);
const CreateBlogDetail = lazy(
  () => import("../../pages/(user)/Blogs/CreateBlogDetail/CreateBlogDetail")
);

// Admin routes
const Admin = lazy(() => import("../../pages/(admin)/Dashboard/index"));
const Accounts = lazy(() => import("../../pages/(admin)/Accounts"));
const AccountDetail = lazy(
  () => import("../../pages/(admin)/Accounts/AccountDetail")
);
const RoleManagement = lazy(() => import("../../pages/(admin)/RoleManagement"));

// Manager routes
const BlogManagementList = lazy(
  () => import("../../pages/(manager)/Blog/BlogManagementList")
);
const BlogManagementView = lazy(
  () => import("../../pages/(manager)/BlogDetail/index")
);
const HotelManagement = lazy(() => import("../../pages/(manager)/Hotel"));
const HotelDetail = lazy(
  () => import("../../pages/(manager)/Hotel/HotelDetail")
);

// Wrap lazy-loaded components with Suspense
const SuspenseWrapper = ({
  component: Component,
  requireAuth = false,
}: {
  component: React.ComponentType<any>;
  requireAuth?: boolean;
}) => (
  <ProtectedRoute requireAuth={requireAuth}>
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <SuspenseWrapper component={UnAuthHome} />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/home",
        element: (
          <AuthLayout>
            <SuspenseWrapper component={AuthHome} requireAuth={true} />
          </AuthLayout>
        ),
        errorElement: <ErrorBoundary />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/auth",
    errorElement: <ErrorBoundary />,
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
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
        path: "verify-email/:token",
        element: <SuspenseWrapper component={VerifyScreen} />,
      },
      {
        path: "reset-password/:token",
        element: <SuspenseWrapper component={ResetPassword} />,
      },
      {
        path: "oauth-success",
        element: (
          <AuthLayout>
            <SuspenseWrapper component={OauthSuccess} />
          </AuthLayout>
        ),
      },
    ],
  },
  {
    path: "/profile",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: "",
        element: <SuspenseWrapper component={Dashboard} requireAuth={true} />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },

  {
    path: "/hotels",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: "",
        element: <SuspenseWrapper component={Hotels} />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: <SuspenseWrapper component={Admin} requireAuth={true} />,
      },
      {
        path: "accounts",
        children: [
          {
            path: "",
            element: (
              <SuspenseWrapper component={Accounts} requireAuth={true} />
            ),
          },
          {
            path: "detail/:id",
            element: (
              <SuspenseWrapper component={AccountDetail} requireAuth={true} />
            ),
          },
        ],
      },

      {
        path: "role-management",
        element: (
          <SuspenseWrapper component={RoleManagement} requireAuth={true} />
        ),
      },
    ],
  },
  {
    path: "/trips",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: ":id",
        element: (
          <AuthLayout>
            <SuspenseWrapper component={CreateTripDetails} requireAuth={true} />
          </AuthLayout>
        ),
      },
      {
        path: "create",
        element: (
          <AuthLayout>
            <SuspenseWrapper component={CreateTrip} requireAuth={true} />
          </AuthLayout>
        ),
      },
      {
        path: "plan",
        caseSensitive: true,
        element: (
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        ),
        children: [
          {
            path: ":id",
            element: (
              <SuspenseWrapper
                component={CreateTripDetails}
                requireAuth={true}
              />
            ),
          },
        ],
      },
      {
        path: "invite/:id",
        element: <InviteRedirect />,
      },
      {
        path: ":tripId/join",
        element: <TripJoinViaEmail />,
      },
    ],
  },
  {
    path: "/manager",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: <Navigate to="/manager/blogs" replace />,
      },
      {
        path: "blogs",
        children: [
          {
            path: "",
            element: (
              <SuspenseWrapper
                component={BlogManagementList}
                requireAuth={true}
              />
            ),
          },
          {
            path: ":id",
            element: (
              <SuspenseWrapper
                component={BlogManagementView}
                requireAuth={true}
              />
            ),
          },
        ],
      },
      {
        path: "media",
        errorElement: <ErrorBoundary />,
        element: <SuspenseWrapper component={Media} requireAuth={true} />,
      },
      {
        path: "hotels",
        children: [
          {
            path: "",
            element: (
              <SuspenseWrapper component={HotelManagement} requireAuth={true} />
            ),
          },
          {
            path: "detail/:id",
            element: (
              <SuspenseWrapper component={HotelDetail} requireAuth={true} />
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/blogs",
    element: <Outlet />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <SuspenseWrapper component={BlogList} />,
      },
      {
        path: "edit/:id",
        element: (
          <SuspenseWrapper component={CreateBlogDetail} requireAuth={true} />
        ),
      },
      {
        path: ":id",
        element: <SuspenseWrapper component={BlogDetail} />,
      },
      {
        path: "create",
        element: <SuspenseWrapper component={CreateBlog} requireAuth={true} />,
      },
    ],
  },
]);

export default router;
