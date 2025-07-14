import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center h-svh bg-neutral-300">
        <div className="flex bg-[rgb(239,239,239)] p-4  items-center w-full justify-between rounded-md shadow-lg">
          <div className="flex ">
            <h1 className="code font-extrabold text-[60px]">ERROR</h1>
            <p className="play-fair text-[40px]">{error?.status}</p>
          </div>
          <div>
            <p className="text-[16px] uppercase code">
              {error?.data.substring(0, 100) || "An error occurred"}
            </p>
            <p className="text-[16px] uppercase code">
              But we find a cool{" "}
              <a
                href="https://www.youtube.com/shorts/wdjpworLSk8"
                target="_blank"
                className="hover:text-blue-500 code hover:underline"
              >
                cat
              </a>{" "}
              video instead
            </p>
          </div>
          <div>
            <img
              src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGV1NmUwcDE2c3lqNGduM21ndXRpZmRyM2R4Y254bWJ3dmg5NHliayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/vboZVH1oDiLdctj4V3/giphy.gif"
              alt="cat"
              className="h-40 shadow-lg rotate-12"
            />
          </div>
          <div>
            <Link to="/" className="font-medium underline code ">
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle any other unexpected errors
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-svh bg-neutral-300">
      <h1 className="mb-4 text-3xl font-bold text-red-600">Unexpected Error</h1>
      <p className="mb-4 text-lg">
        An unexpected error occurred while rendering the page.
      </p>
      {error instanceof Error && (
        <pre className="p-4 text-sm text-left bg-gray-100 rounded">
          {error.message}
        </pre>
      )}
    </div>
  );
};

export default ErrorBoundary;
