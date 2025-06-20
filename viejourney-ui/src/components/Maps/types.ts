import { ReactNode } from "react";
import { MapProps as GoogleMapProps } from "@vis.gl/react-google-maps";
// Use Place as the base type for POI data
export type POIData = google.maps.places.Place;
export type OldPOIData = google.maps.places.PlaceResult;
export interface SearchPlacesControlProps {
  onPlaceSelected?: (place: google.maps.places.Place) => void;
  placeholder?: string;
  width?: string | number;
}

// Interface for the option items shown in the Autocomplete dropdown
export interface AutocompleteOption {
  placeId: string;
  primaryText: string;
  secondaryText?: string;
}

export interface MapProps extends Omit<GoogleMapProps, "style"> {
  apiKey?: string;
  containerStyle?: React.CSSProperties;
  showMapTypeControl?: boolean;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
  showDetailsControl?: boolean;
  detailed?: boolean;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  position: "relative" | "absolute" | "fixed" | "sticky" | "static";
}
