import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

// Define route titles
export const routeTitles: Record<string, string> = {
  "/": "Home - VieJourney",
  "/home": "Dashboard - VieJourney",
  "/auth/login": "Login - VieJourney",
  "/auth/register": "Register - VieJourney",
  "/auth/verify-email/:token": "Verify Email - VieJourney",
  "/auth/reset-password/:token": "Reset Password - VieJourney",
  "/auth/oauth-success": "Authentication Successful - VieJourney",
  "/profile": "Profile - VieJourney",
  "/guides": "Travel Guides - VieJourney",
  "/guides/detail": "Guide Details - VieJourney",
  "/hotels": "Hotels - VieJourney",
  "/admin/dashboard": "Admin Dashboard - VieJourney",
  "/admin/accounts": "Manage Accounts - VieJourney",
  "/admin/accounts/detail/:id": "Account Details - VieJourney",
  "/admin/media": "Media Manager - VieJourney",
  "/trip/create": "Create Trip - VieJourney",
  "/trip/:id": "Trip Details - VieJourney",
  // fallback:
  "*": "VieJourney - Explore Vietnam",
};

export const PageTitle = () => {
  const location = useLocation();

  // Find exact match or try path pattern matching
  const getTitle = (path: string) => {
    // Direct match
    if (routeTitles[path]) return routeTitles[path];

    // Try to match patterns with parameters
    const pathSegments = path.split("/");

    for (const [routePath, title] of Object.entries(routeTitles)) {
      // Skip the fallback
      if (routePath === "*") continue;

      const routeSegments = routePath.split("/");

      // Different segment length, can't match
      if (pathSegments.length !== routeSegments.length) continue;

      let matches = true;
      for (let i = 0; i < routeSegments.length; i++) {
        // If it's a parameter (starts with :) or segments match
        if (
          !routeSegments[i].startsWith(":") &&
          routeSegments[i] !== pathSegments[i]
        ) {
          matches = false;
          break;
        }
      }

      if (matches) return title;
    }

    // Fallback
    return routeTitles["*"];
  };

  const title = getTitle(location.pathname);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

// Then in your main layout or App.tsx
export const AppWithTitles = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageTitle />
      {children}
    </>
  );
};
