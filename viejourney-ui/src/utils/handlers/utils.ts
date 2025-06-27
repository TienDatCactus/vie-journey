import dayjs from "dayjs";

export function getDatesBetween(startDate: Date, endDate: Date): string[] {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const dates: string[] = [];

  let current = start;

  while (current.isBefore(end) || current.isSame(end, "day")) {
    dates.push(current.format("dddd, Do MMMM")); // → Wednesday, 11th June
    current = current.add(1, "day");
  }

  return dates;
}

export function getPlacePhotoUrl(photo: any): string {
  const fallbackImage = "/images/placeholder-main.png";
  if (!photo) return fallbackImage;

  try {
    // Method 1: Try getUrl() with maxWidth parameter (standard Google Maps JS API v3 approach)
    if (typeof photo.getUrl === "function") {
      try {
        return photo.getUrl({ maxWidth: 800 });
      } catch (e) {
        console.log("getUrl with params failed", e);
      }
    }

    // Method 2: Try getUrl() without parameters (some API versions)
    if (typeof photo.getUrl === "function") {
      try {
        return photo.getUrl();
      } catch (e) {
        console.log("getUrl without params failed", e);
      }
    }

    // Method 3: Try getURI method (older or custom implementations)
    if (typeof photo.getURI === "function") {
      try {
        return photo.getURI();
      } catch (e) {
        console.log("getURI failed", e);
      }
    }

    // Method 4: Check if photo is a string URL directly
    if (typeof photo === "string") {
      return photo;
    }

    // Method 5: Check for common URL properties
    if (photo.url) return photo.url;

    // Method 6: Check if there's a photo reference we can use with Places Photo API
    if (photo.name || photo.photoReference || photo.photo_reference) {
      const photoRef =
        photo.name || photo.photoReference || photo.photo_reference;
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
      if (photoRef && apiKey) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
      }
    }

    // Return fallback if all methods fail
    return fallbackImage;
  } catch (error) {
    console.error("Error getting photo URL:", error);
    return fallbackImage;
  }
}
