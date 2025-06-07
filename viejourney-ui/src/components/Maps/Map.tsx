import { Box, Typography } from "@mui/material";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";
import { useMapLoader } from "../../utils/hooks/use-map-loader";
import CurrentLocationControl from "./controls/CurrentLocationControl";
import POIDetails from "./controls/POIDetails";
import SearchPlacesControl from "./controls/SearchPlacesControl";
import { MapProps, POIData } from "./types";
import usePlaces from "../../utils/hooks/usePlaces";

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
    if (!mapInstance || !coreLib || !placesLib) return;

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

          // Use the new fetchFields method instead of getDetails
          place
            .fetchFields({
              fields: [
                // Basic Info
                "id",
                "displayName",
                "photos",
                "types",
                "businessStatus",
                // Location & Address
                "location",
                "viewport",
                "formattedAddress",
                "adrFormatAddress",
                "addressComponents",
                "plusCode",

                // Contact & Operational
                "internationalPhoneNumber",
                "nationalPhoneNumber",
                "websiteURI",
                "regularOpeningHours",
                "utcOffsetMinutes",

                // Ratings & Pricing
                "rating",
                "userRatingCount",
                "priceLevel",

                // Qualitative & Amenities
                "reviews",
                "editorialSummary",
                "parkingOptions",
                "paymentOptions",
                "isReservable",
                "hasOutdoorSeating",
                "servesBreakfast",
                "servesLunch",
                "servesDinner",
                "servesCoffee",
                "servesBeer",
                "servesWine",
                "hasTakeout",
                "hasDelivery",
                "hasCurbsidePickup",
                "hasDineIn",
                "isGoodForChildren",
                "isGoodForGroups",
                "allowsDogs",
                "hasLiveMusic",
                "accessibilityOptions",
                "googleMapsURI",
              ],
            })
            .then((result) => {
              if (result && onPOIClick) {
                // Transform the data to match your POIData interface
                // const poiData: POIData = {
                //   id: result.place.id,
                //   displayName: result.place.displayName || "",
                //   location: result.place.location,
                //   formattedAddress: result.place.formattedAddress,
                //   types: result.place.types || [],
                //   photos: result.place.photos || [],
                //   rating: result.place.rating,
                //   userRatingCount: result.place.userRatingCount,
                //   priceLevel: result.place.priceLevel,
                //   websiteURI: result.place.websiteURI,
                //   nationalPhoneNumber: result.place.nationalPhoneNumber || "",
                //   internationalPhoneNumber:
                //     result.place.internationalPhoneNumber || "",
                //   businessStatus: result.place.businessStatus,
                //   editorialSummary: result.place.editorialSummary,
                //   googleMapsURI: result.place.googleMapsURI,
                //   // Additional amenities
                //   isReservable: result.place.isReservable,
                //   hasOutdoorSeating: result.place.hasOutdoorSeating,
                //   servesFood: {
                //     vegetarian: result.place.servesVegetarianFood || false,
                //     breakfast: result.place.servesBreakfast || false,
                //     brunch: result.place.servesBrunch || false,
                //     lunch: result.place.servesLunch || false,
                //     dinner: result.place.servesDinner || false,
                //     dessert: result.place.servesDessert || false,
                //   },
                //   servesDrinks: {
                //     beer: result.place.servesBeer || false,
                //     wine: result.place.servesWine || false,
                //     cocktails: result.place.servesCocktails || false,
                //     coffee: result.place.servesCoffee || false,
                //   },
                //   hasTakeout: result.place.hasTakeout || false,
                //   hasDelivery: result.place.hasDelivery || false,
                //   accessibilityOptions: result.place.accessibilityOptions,
                //   reviews: result.place.reviews || [],
                //   allowsDogs: result.place.allowsDogs || false,
                //   hasWiFi: result.place.hasWiFi || false,
                //   isGoodForChildren: result.place.isGoodForChildren || false,
                //   isGoodForGroups: result.place.isGoodForGroups || false,

                // };
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

// Props for our custom Map component

// Main Map component
const Map: React.FC<MapProps> = ({
  containerStyle = { width: "100vw", height: "100vh" },
  showMapTypeControl = true,
  onMapClick,
  onPOIClick,
  onLoad,
  onError,
  children,
  showDetailsControl = true,
  ...mapProps
}) => {
  // Use custom hooks for places and map loading
  const {
    selectedPOI,
    highlightedPOI,
    isDrawerOpen,
    handlePlaceSelect,
    handlePOIClick,
    toggleDrawer,
  } = usePlaces({ onPOIClick });

  const { locationError, error, handleLocationFound, handleLocationError } =
    useMapLoader({ onLoad, onError });

  // Since APIProvider is now in the app root, we don't need to wrap again
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
      {!error && (
        <GoogleMap
          {...mapProps}
          style={containerStyle}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
        >
          {showDetailsControl && (
            <SearchPlacesControl
              onPlaceSelected={(place) => {
                if (place) {
                  handlePlaceSelect({
                    placeId: place.id || "",
                    primaryText: place.displayName || "",
                  });
                }
              }}
              width={350}
            />
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
      {/* Loading indicator */}
      {/* {loading && (
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
      )} */}
      {/* Error display */}
      {/* {error && (
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
      )} */}
      {/* POI Details Drawer */}
      {isDrawerOpen && (
        <div className="bg-neutral-50 absolute lg:bottom-2 w-[96%] translate-x-[-50%] left-1/2 rounded-xl h-2/3 z-50 shadow-lg">
          {selectedPOI && (
            <POIDetails poi={selectedPOI} onClose={toggleDrawer(false)} />
          )}
        </div>
      )}
    </Box>
  );
};

export default Map;
