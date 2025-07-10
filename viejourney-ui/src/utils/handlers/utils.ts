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
