import dayjs from "dayjs";
import { animate } from "motion/react";
import { ProcessedBlogContent, PlaceData } from "../interfaces";

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
const colorMap: Record<string, string> = {};
const palette = ["#f44336", "#3f51b5", "#4caf50", "#ff9800", "#9c27b0"];

export function getColorForDate(date: string): string {
  if (!colorMap[date]) {
    const index = Object.keys(colorMap).length % palette.length;
    colorMap[date] = palette[index];
  }
  return colorMap[date];
}
export function formatCurrency(
  value: number,
  locale: "en-US" | "ms-MY" | "vi-VN"
): string {
  const currencyMap: Record<typeof locale, string> = {
    "en-US": "USD",
    "ms-MY": "MYR",
    "vi-VN": "VND",
  };

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyMap[locale],
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateSettlements(
  balances: { name: string; balance: number }[]
) {
  // Filter out people with zero balance (they're settled)
  const nonZeroBalances = balances.filter((b) => Math.abs(b.balance) > 0.01);

  // Sort by balance (descending)
  const sortedBalances = [...nonZeroBalances].sort(
    (a, b) => a.balance - b.balance
  );

  const settlements: { from: string; to: string; amount: number }[] = [];

  // Greedy algorithm to minimize number of transactions
  while (sortedBalances.length > 1) {
    const debtor = sortedBalances[0]; // Person who owes the most (most negative balance)
    const creditor = sortedBalances[sortedBalances.length - 1]; // Person who is owed the most

    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

    if (amount > 0.01) {
      // Only add settlements for non-trivial amounts
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount,
      });
    }

    // Update balances
    debtor.balance += amount;
    creditor.balance -= amount;

    // Re-sort or remove settled people
    if (Math.abs(debtor.balance) < 0.01) {
      sortedBalances.shift();
    }

    if (Math.abs(creditor.balance) < 0.01) {
      sortedBalances.pop();
    }
  }

  return settlements;
}
export function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    Flights: "#3b82f6",
    Lodging: "#6366f1",
    "Car rental": "#22c55e",
    Transit: "#f97316",
    Food: "#f59e0b",
    Drinks: "#a855f7",
    Sightseeing: "#06b6d4",
    Activities: "#ec4899",
    Shopping: "#8b5cf6",
    Gas: "#ef4444",
    Groceries: "#14b8a6",
    Other: "#6b7280",
  };

  return colorMap[type] || colorMap.Other;
}

export const smoothScrollTo = (targetY: number) => {
  const currentY = window.scrollY;
  animate(currentY, targetY, {
    duration: 0.8,
    ease: "easeInOut",
    onUpdate(latest) {
      window.scrollTo(0, latest);
    },
  });
};

export const getWordCount = (content: string) => {
  if (!content) return 0;
  const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length;
};

export const processBlogContent = (editor: any): ProcessedBlogContent => {
  if (!editor) {
    return {
      cleanHtml: "<p></p>",
      places: [],
      fullHtml: "<p></p>",
      wordCount: 0,
    };
  }

  const places: PlaceData[] = [];
  let placeCounter = 1;

  // Extract places from editor state
  editor.state.doc.descendants((node: any) => {
    if (node.type.name === "placeAutocomplete") {
      const googlePlace = node.attrs.place;

      // Only process if we have a valid Google Place with data
      if (googlePlace && googlePlace.id && googlePlace.displayName) {
        try {
          const placeData: PlaceData = {
            displayName: googlePlace.displayName,
            placeId: googlePlace.id,
            latitude:
              typeof googlePlace.location?.lat === "function"
                ? googlePlace.location.lat()
                : googlePlace.location?.lat || 0,
            longitude:
              typeof googlePlace.location?.lng === "function"
                ? googlePlace.location.lng()
                : googlePlace.location?.lng || 0,
            editorialSummary: googlePlace.editorialSummary || "",
            types: Array.isArray(googlePlace.types) ? googlePlace.types : [],
            photos:
              googlePlace.photos && googlePlace.photos.length > 0
                ? [getPlacePhotoUrl(googlePlace.photos[0])]
                : [],
            googleMapsURI: googlePlace.googleMapsURI || "",
            showDetails: Boolean(node.attrs.showDetails),
          };

          places.push(placeData);
          console.log(
            `Extracted place ${placeCounter}:`,
            placeData.displayName
          );
          placeCounter++;
        } catch (error) {
          console.error("Error extracting place data:", error);
        }
      }
    }
  });

  // Get full HTML from editor
  const fullHtml = editor.getHTML();

  // Create clean HTML by removing place nodes entirely
  let cleanHtml = fullHtml;

  // Remove all place autocomplete nodes from the HTML
  cleanHtml = cleanHtml.replace(
    /<div[^>]*data-type="place-autocomplete"[^>]*>[\s\S]*?<\/div>/g,
    ""
  );

  // Clean up any extra empty paragraphs or whitespace
  cleanHtml = cleanHtml
    .replace(/<p><\/p>/g, "") // Remove empty paragraphs
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Ensure we have at least one paragraph
  if (!cleanHtml || cleanHtml === "") {
    cleanHtml = "<p></p>";
  }

  console.log("Blog content processed:", {
    placesFound: places.length,
    placeNames: places.map((p) => p.displayName),
    cleanHtmlLength: cleanHtml.length,
  });

  return {
    cleanHtml,
    places,
    fullHtml,
    wordCount: getWordCount(cleanHtml),
  };
};
