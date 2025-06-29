import Search from "@mui/icons-material/Search";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useApiIsLoaded,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";
import { useDirectionStore } from "../../services/stores/useDirectionStore";
import { useMapPan } from "../../services/stores/useMapPan";
import useCategorySearch from "../../utils/hooks/use-category-search";
import { useMapLoader } from "../../utils/hooks/use-map-loader";
import usePOI from "../../utils/hooks/use-poi";
import { MarkerCluster, PlaceMarker } from "./controls";
import CurrentLocationControl from "./controls/CurrentLocationControl";
import { DirectionsRender } from "./controls/DirectionRender";
import GeneralFilter from "./controls/GeneralFilter";
import POIDetails from "./controls/POIDetails";
import { MapProps, POIData } from "./types";

// Map configuration component with POI click disabling
const MapConfiguration: React.FC<{
  showMapTypeControl?: boolean;
  onClick?: (event: google.maps.MapMouseEvent) => void;
  onPOIClick?: (poi: any) => void;
}> = ({ showMapTypeControl = false, onClick, onPOIClick }) => {
  const mapInstance = useMap();
  const coreLib = useMapsLibrary("core");
  const placesLib = useMapsLibrary("places");
  useEffect(() => {
    if (!mapInstance || !coreLib || !placesLib) return; // Disable Google Maps analytics collection to prevent CSP errors
    if (window.google && window.google.maps) {
      // Apply settings that disable analytics and tracking that cause CSP issues
      (window.google.maps as any).disablePostfixUnitsRequests = true;
      (window.google.maps as any).disableCommunitiesLogging = true;
      (window.google.maps as any).disableAttributionPrefixRequests = true;
    }

    mapInstance.setOptions({
      gestureHandling: "greedy",
      disableDefaultUI: !showMapTypeControl,
      mapTypeControl: showMapTypeControl,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const clickListener = mapInstance.addListener(
      "click",
      (event: google.maps.MapMouseEvent) => {
        const eventWithPlace = event as google.maps.MapMouseEvent & {
          placeId?: string;
        };

        if (eventWithPlace.placeId && onPOIClick && placesLib) {
          event.stop();

          // Create a new Place instance with the placeId
          const place = new placesLib.Place({
            id: eventWithPlace.placeId,
          });

          place
            .fetchFields({
              fields: [...import.meta.env.VITE_MAP_FIELDS.split(",")],
            })
            .then((result) => {
              if (result && onPOIClick) {
                onPOIClick(result.place as POIData);
              }
            })
            .catch((error) => {
              console.error("Error fetching place details:", error);
            });
        } else if (onClick) {
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

// Main Map component
const Map: React.FC<MapProps> = ({
  containerStyle = { width: "100vw", height: "100vh" },
  showMapTypeControl = true,
  onMapClick,
  onLoad,
  onError,
  children,
  showDetailsControl = true,
  detailed = true,
  initialCenter,
  position = "relative",
  ...mapProps
}) => {
  const { selected } = useMapPan();
  const isApiLoaded = useApiIsLoaded();
  const {
    selectedCategories,
    categoryResults,
    handleCategoryToggle,
    searchPlacesInBounds,
    isSearching,
    hasSearched,
  } = useCategorySearch({});

  const {
    selectedPOI,
    highlightedPOI,
    isDrawerOpen,
    handleCloseDrawer,
    handlePOIClick,
  } = usePOI();

  const mapInstance = useMap();
  const { locationError, error, handleLocationFound, handleLocationError } =
    useMapLoader({ onLoad, onError });

  const { places, travelMode } = useDirectionStore();

  const originPlaceId = places[0]?.id;
  const destinationPlaceId = places[places.length - 1]?.id;
  const waypointsPlaceIds = places.slice(1, -1).map((place) => place.id);

  console.log("Map component loaded with places:", places);
  const groupedByDate = places.reduce((acc, place) => {
    const date = place.fromDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(place);
    return acc;
  }, {} as Record<string, { id: string; fromDate: string }[]>);

  console.log(groupedByDate);
  useEffect(() => {
    if (selected && mapInstance && selected.location) {
      mapInstance.panTo({
        lat: selected.location.lat(),
        lng: selected.location.lng(),
      });
      mapInstance.setZoom(14);
    }
  }, [selected, mapInstance]);

  return (
    <Box sx={{ position: position, width: "100%", height: "100%" }}>
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
      {!error && isApiLoaded && (
        <GoogleMap
          {...mapProps}
          style={containerStyle}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
          center={initialCenter}
        >
          {originPlaceId &&
            destinationPlaceId &&
            Object.entries(groupedByDate).map(([date, groupedPlaces]) => {
              if (groupedPlaces.length < 2) return null;

              const origin = groupedPlaces[0].id;
              const destination = groupedPlaces[groupedPlaces.length - 1].id;
              const waypoints = groupedPlaces.slice(1, -1).map((p) => p.id);

              return (
                <DirectionsRender
                  key={date}
                  originPlaceId={origin}
                  destinationPlaceId={destination}
                  waypointsPlaceIds={waypoints}
                  travelMode={travelMode || google.maps.TravelMode.DRIVING}
                  fromDate={date}
                />
              );
            })}

          {selected && (
            <PlaceMarker place={selected} onClick={handlePOIClick} />
          )}
          <CurrentLocationControl
            onLocationFound={handleLocationFound}
            onLocationError={handleLocationError}
          />
          <MapConfiguration
            showMapTypeControl={showMapTypeControl}
            onClick={onMapClick}
            onPOIClick={handlePOIClick}
          />

          {/* Add category search UI when enabled */}
          {selectedCategories.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white text-dark-900"
              onClick={searchPlacesInBounds}
              disabled={isSearching}
              startIcon={
                isSearching ? <CircularProgress size={20} /> : <Search />
              }
            >
              {isSearching ? "Searching..." : "Search This Area"}
            </Button>
          )}
          {detailed && (
            <>
              <GeneralFilter
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
              />
              <MarkerCluster
                places={categoryResults}
                onPlaceClick={handlePOIClick}
                selectedPlace={selectedPOI}
              />
            </>
          )}

          {/* If we have a highlighted POI, show a custom marker */}
          {highlightedPOI && selectedPOI?.location && (
            <AdvancedMarker
              position={selectedPOI.location}
              title={selectedPOI.displayName}
              zIndex={1000}
              className="group transition-transform duration-200 transform hover:scale-110"
            >
              <div className="p-1 rounded-full bg-white shadow-md">
                <Pin
                  scale={1.4}
                  background="#1976d2"
                  glyphColor="#ffffff"
                  borderColor="#ffffff"
                />
              </div>
            </AdvancedMarker>
          )}

          {children}
        </GoogleMap>
      )}
      {hasSearched && categoryResults.length === 0 && !isSearching && (
        <div className="no-results-message">
          No places found in this area. Try zooming out or changing categories.
        </div>
      )}
      {!isApiLoaded && (
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

      {/* POI Details Drawer */}
      {detailed && isDrawerOpen && (
        <div className="bg-neutral-50 absolute lg:bottom-2 w-[96%] translate-x-[-50%] left-1/2 rounded-xl h-2/3 z-50 shadow-lg">
          {selectedPOI && (
            <POIDetails poi={selectedPOI} onClose={handleCloseDrawer} />
          )}
        </div>
      )}
    </Box>
  );
};

export default Map;
