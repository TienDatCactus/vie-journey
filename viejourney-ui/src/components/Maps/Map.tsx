import { Box, CircularProgress, Drawer, Typography } from "@mui/material";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  MapProps as GoogleMapProps,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { ReactNode, useEffect, useState } from "react";
import CurrentLocationControl from "./controls/CurrentLocationControl";
import SearchPlacesControl from "./controls/SearchPlacesControl";
import POIDetails from "./POIDetails";

// Map configuration component with POI click disabling
const MapConfiguration: React.FC<{
  showMapTypeControl?: boolean;
  onClick?: (event: google.maps.MapMouseEvent) => void;
  onPOIClick?: (poi: any) => void; // Accept any to handle both Place and PlaceResult
}> = ({ showMapTypeControl = false, onClick, onPOIClick }) => {
  const mapInstance = useMap();
  const coreLib = useMapsLibrary("core");
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!mapInstance || !coreLib) return;

    mapInstance.setOptions({
      gestureHandling: "greedy",
      disableDefaultUI: !showMapTypeControl,
      mapTypeControl: showMapTypeControl,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // 2. Add custom click listener
    const clickListener = mapInstance.addListener(
      "click",
      (event: google.maps.MapMouseEvent) => {
        // Need to use the placeId from the additional property that's not in the type definition
        const eventWithPlace = event as google.maps.MapMouseEvent & {
          placeId?: string;
        };

        // Check if this is a POI click
        if (eventWithPlace.placeId && onPOIClick && placesLib) {
          // Prevent the default info window from opening
          event.stop();

          // Create a PlacesService instance
          const placesService = new placesLib.PlacesService(mapInstance);

          // Fetch place details using the placeId
          placesService.getDetails(
            {
              placeId: eventWithPlace.placeId,
              fields: [
                "place_id",
                "geometry",
                "name",
                "formatted_address",
                "types",
                "photos",
                "rating",
                "user_ratings_total",
                "price_level",
                "website",
                "formatted_phone_number",
                "business_status",
                "opening_hours",
              ],
            },
            (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place
              ) {
                // Just pass the place object directly
                // The handler will detect which format it is
                onPOIClick(place);
              } else {
                console.error("Error fetching place details:", status);
              }
            }
          );
        } else if (onClick) {
          // Regular map click (not on a POI)
          onClick(event);
        }
      }
    );

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [
    mapInstance,
    coreLib,
    placesLib,
    showMapTypeControl,
    onClick,
    onPOIClick,
  ]);

  return null;
};

// Interface for our POI data
export interface POIData {
  id: string;
  name: string;
  location?: google.maps.LatLng;
  address?: string | null;
  types?: string[];
  photos?: google.maps.places.Photo[];
  rating?: number | null;
  userRatingCount?: number | null;
  priceLevel?: google.maps.places.PriceLevel | null;
  websiteUri?: string | null;
  phoneNumber?: string | null;
  businessStatus?: string | null;
  isOpen?: boolean | null;
  regularOpeningHours?: google.maps.places.OpeningHours | null;
}

// Props for our custom Map component
export interface MapProps extends Omit<GoogleMapProps, "style"> {
  apiKey?: string;
  containerStyle?: React.CSSProperties;
  showMapTypeControl?: boolean;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onPOIClick?: (poiData: POIData) => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
}

// Main Map component
const Map: React.FC<MapProps> = ({
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  containerStyle = { width: "100vw", height: "100vh" },
  showMapTypeControl = true,
  onMapClick,
  onPOIClick,
  onLoad,
  onError,
  children,
  ...mapProps
}) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // State for selected POI
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
  const [isPOIDrawerOpen, setIsPOIDrawerOpen] = useState(false);
  const [highlightedPOI, setHighlightedPOI] = useState<string | null>(null);

  const handleLocationFound = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setUserLocation({ lat: latitude, lng: longitude });
  };
  const handleLocationError = (error: GeolocationPositionError) => {
    const errorMsg = `Couldn't access your location: ${error.message}`;
    setLocationError(errorMsg);
    console.error(errorMsg);
    setTimeout(() => setLocationError(null), 5000); // Clear after 5 seconds
  };

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = (error: unknown) => {
    setLoading(false);
    setError(error instanceof Error ? error : new Error(String(error)));
    if (onError)
      onError(error instanceof Error ? error : new Error(String(error)));
  };

  const handlePlaceSelected = (place: google.maps.places.Place) => {
    console.log("Selected place from search:", place);

    // Convert Place to POIData
    const poiData: POIData = {
      id: place.id || "",
      name: place.displayName || "",
      location: place.location || undefined,
      address: place.formattedAddress,
      types: place.types,
      photos: place.photos,
      rating: place.rating,
      userRatingCount: place.userRatingCount,
      priceLevel: place.priceLevel,
      websiteUri: place.websiteURI?.toString(),
      phoneNumber: place.nationalPhoneNumber,
      businessStatus: place.businessStatus,
      regularOpeningHours: place.regularOpeningHours,
    };

    handlePOIClick(poiData);
  };
  // Handle POI clicks from Google Maps
  const handleGooglePOIClick = (place: any) => {
    console.log("Google POI clicked:", place);

    // Check if this is a PlaceResult (from PlacesService) or Place (from modern Places API)
    const isPlaceResult = place.place_id !== undefined;

    // Convert both formats to POIData
    const poiData: POIData = {
      id: isPlaceResult ? place.place_id : place.id || "",
      name: isPlaceResult ? place.name : place.displayName || "",
      location: isPlaceResult
        ? place.geometry?.location
        : place.location || undefined,
      address: isPlaceResult ? place.formatted_address : place.formattedAddress,
      types: place.types,
      photos: place.photos,
      rating: place.rating,
      userRatingCount: isPlaceResult
        ? place.user_ratings_total
        : place.userRatingCount,
      priceLevel: place.price_level || place.priceLevel,
      websiteUri: isPlaceResult ? place.website : place.websiteURI?.toString(),
      phoneNumber: isPlaceResult
        ? place.formatted_phone_number
        : place.nationalPhoneNumber,
      businessStatus: place.business_status || place.businessStatus,
      regularOpeningHours: isPlaceResult
        ? place.opening_hours
        : place.regularOpeningHours,
    };

    handlePOIClick(poiData);
  };

  const handlePOIClick = (poiData: POIData) => {
    console.log("POI clicked:", poiData);
    setSelectedPOI(poiData);
    setHighlightedPOI(poiData.id);
    setIsPOIDrawerOpen(true);

    if (onPOIClick) {
      onPOIClick(poiData);
    }
  };

  const handleCloseDrawer = () => {
    setIsPOIDrawerOpen(false);
    setTimeout(() => {
      setHighlightedPOI(null);
      // Optionally clear selectedPOI after animation completes
      // setSelectedPOI(null);
    }, 300);
  };
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {locationError && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "error.main",
            color: "white",
            padding: 1,
            borderRadius: 1,
            zIndex: 1000,
          }}
        >
          <Typography variant="body2">{locationError}</Typography>
        </Box>
      )}
      <APIProvider
        apiKey={apiKey}
        onLoad={handleLoad}
        onError={handleError}
        libraries={["places", "marker"]}
      >
        {!error && (
          <GoogleMap
            {...mapProps}
            style={containerStyle}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
          >
            <SearchPlacesControl
              onPlaceSelected={handlePlaceSelected}
              width={350}
            />
            <CurrentLocationControl
              onLocationFound={handleLocationFound}
              onLocationError={handleLocationError}
            />
            <MapConfiguration
              showMapTypeControl={showMapTypeControl}
              onClick={onMapClick}
              onPOIClick={handleGooglePOIClick}
            />

            {/* If we have a highlighted POI, show a custom marker */}
            {highlightedPOI && selectedPOI?.location && (
              <AdvancedMarker
                position={selectedPOI.location}
                title={selectedPOI.name}
                zIndex={1000}
              >
                <Pin
                  scale={1.5}
                  background="#1976d2"
                  glyphColor="#ffffff"
                  borderColor="#0d47a1"
                />
              </AdvancedMarker>
            )}

            {children}
          </GoogleMap>
        )}

        {/* Loading indicator */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error display */}
        {error && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              padding: 3,
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Failed to load Google Maps
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {error.message || "Please check your API key and try again."}
            </Typography>
          </Box>
        )}

        {/* POI Details Drawer */}
        <Drawer
          anchor="right"
          open={isPOIDrawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: 350 },
              maxWidth: "100%",
            },
          }}
        >
          {selectedPOI && (
            <POIDetails poi={selectedPOI} onClose={handleCloseDrawer} />
          )}
        </Drawer>
      </APIProvider>
    </Box>
  );
};

export default Map;
