// Use Place as the base type for POI data
export type POIData = google.maps.places.Place & {
  servesFood?: {
    vegetarian?: boolean;
    breakfast?: boolean;
    brunch?: boolean;
    lunch?: boolean;
    dinner?: boolean;
    dessert?: boolean;
  };
  servesDrinks?: {
    beer?: boolean;
    wine?: boolean;
    cocktails?: boolean;
    coffee?: boolean;
  };
};

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
