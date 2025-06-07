# Google Places Autocomplete Integration

This document provides an overview of how the Google Places Autocomplete functionality has been unified in the VieJourney application.

## Previously Existing Hooks

The application had multiple hooks for handling Google Places functionality:

1. **usePlacesAutocomplete.tsx** - A custom hook for direct Google Maps Places API autocomplete
2. **use-autocomplete-suggestions.ts** - A hook using the vis.gl React Google Maps library
3. **use-places.ts** - A hook for handling POI (Point of Interest) interactions

## Unified Solution

The new solution consolidates all these hooks into a unified approach:

### 1. Unified `usePlaces` Hook

Located at `src/utils/hooks/usePlaces.tsx`, this hook combines the functionality of all previous hooks:

- Supports both direct Google Maps API and vis.gl's React Google Maps library
- Handles place autocomplete suggestions
- Manages POI selection and UI state
- Fetches place details
- Provides consistent interfaces for both component and context-based usage

### 2. Reusable `GooglePlacesAutocomplete` Component

Located at `src/components/Common/GooglePlacesAutocomplete/GooglePlacesAutocomplete.tsx`, this component:

- Uses the unified hook
- Provides a complete UI solution for place searching
- Is highly customizable through props
- Supports both direct usage and integration with contexts

### 3. Updated Context API

The PlaceSearchContext has been updated to use the unified hook, ensuring:

- A consistent API across the application
- Simplified state management
- Better integration between different parts of the application

## Benefits of the New Approach

### 1. Unified API

- **Single Source of Truth**: All Google Places functionality comes from a single hook
- **Consistent Types**: Types are shared across components and contexts
- **Flexible Integration**: Works with both direct use and Zustand-based state management

### 2. Enhanced Reliability

- **Fallback Support**: Uses both direct Google API and vis.gl, providing redundancy
- **Error Handling**: Better error handling and fallback mechanisms

### 3. Simplified Development

- **Reduced Code Duplication**: Eliminates duplicate functionality across multiple hooks
- **Better Maintainability**: Changes only need to be made in one place
- **Clear Documentation**: Unified documentation for all places-related functionality

## Usage Examples

### Basic Component Usage

```tsx
import { GooglePlacesAutocomplete } from "../../components/Common/GooglePlacesAutocomplete";

const MyComponent = () => {
  const handlePlaceSelect = (placeDetails) => {
    console.log("Selected place:", placeDetails);
  };

  return (
    <GooglePlacesAutocomplete
      onPlaceSelect={handlePlaceSelect}
      placeholder="Search for a location"
    />
  );
};
```

### Using the Hook Directly

```tsx
import { usePlaces } from "../../utils/hooks/usePlaces";
import { Autocomplete, TextField } from "@mui/material";

const MyComponent = () => {
  const {
    inputValue,
    options,
    selectedOption,
    isLoading,
    handlePlaceSelect,
    handleInputChange,
  } = usePlaces({
    fetchPlaceDetails: true,
    onPlaceSelect: (details) => console.log("Selected:", details),
  });

  return (
    <Autocomplete
      options={options}
      loading={isLoading}
      value={selectedOption}
      onChange={(_, option) => handlePlaceSelect(option)}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      renderInput={(params) => <TextField {...params} label="Location" />}
    />
  );
};
```

### With Context API

```tsx
import { usePlaceSearch } from "../../services/contexts/PlaceSearchContext";
import { GooglePlacesAutocomplete } from "../../components/Common/GooglePlacesAutocomplete";

const MyLocationSearch = () => {
  const { selectedPlace } = usePlaceSearch();

  return (
    <div>
      <GooglePlacesAutocomplete />
      {selectedPlace && (
        <div>
          <h3>Selected: {selectedPlace.displayName.text}</h3>
          <p>Address: {selectedPlace.formattedAddress}</p>
        </div>
      )}
    </div>
  );
};
```

## Migration Guide

To migrate existing code to the new API:

1. Replace `usePlacesAutocomplete` with `usePlaces`
2. Replace `useAutocompleteSuggestions` with `usePlaces`
3. Replace direct Autocomplete components with `GooglePlacesAutocomplete`
4. Update any contexts to use the unified hook

## API Reference

See the type definitions in the following files:

- `src/utils/hooks/usePlaces.tsx`
- `src/components/Common/GooglePlacesAutocomplete/GooglePlacesAutocomplete.tsx`
