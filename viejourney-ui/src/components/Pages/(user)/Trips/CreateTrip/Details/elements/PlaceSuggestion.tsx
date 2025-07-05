import { Add, Place } from "@mui/icons-material";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Itinerary } from "../../../../../../../services/stores/storeInterfaces";
import { getPlacePhotoUrl } from "../../../../../../../utils/handlers/utils";
const PlaceSuggestion: React.FC<{
  place: Itinerary["place"] | null;
  onAddPlace: (placeId: string) => void;
}> = ({ place, onAddPlace }) => {
  const [nearbyPlaces, setNearbyPlaces] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    // Only fetch if we have a valid place with location
    if (!placesLib || !place?.location) return;

    const fetchNearbyPlaces = async () => {
      setLoadingNearby(true);
      setError(null);

      try {
        const service = new placesLib.PlacesService(
          document.createElement("div")
        );

        // Make sure location is not null
        if (!place.location) {
          throw new Error("Place location is not available");
        }

        const request: google.maps.places.PlaceSearchRequest = {
          location: place.location,
          type: "tourist_attraction",
          keyword: "famous places",

          rankBy: placesLib.RankBy.DISTANCE,
        };

        const results = await new Promise<google.maps.places.PlaceResult[]>(
          (resolve, reject) => {
            service.nearbySearch(request, (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                resolve(results);
              } else {
                reject(new Error(`Places API error: ${status}`));
              }
            });
          }
        );
        const filtered = results
          .filter(
            (place) =>
              place.rating &&
              place.rating >= 3 &&
              place.user_ratings_total &&
              place.user_ratings_total >= 20
          )
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

        setNearbyPlaces(filtered);
      } catch (err: any) {
        console.error("Error fetching nearby places:", err);
        setError(err.message);
      } finally {
        setLoadingNearby(false);
      }
    };

    fetchNearbyPlaces();
  }, [place, placesLib]);

  return (
    <div className="mt-4">
      <Typography
        variant="subtitle1"
        className="font-medium mb-2 text-gray-500"
      >
        {place?.displayName
          ? `Places to visit near ${place.displayName}`
          : "Suggested nearby places"}
      </Typography>

      {loadingNearby && (
        <div className="flex justify-center p-4">
          <CircularProgress size={24} />
        </div>
      )}

      {error && (
        <Typography color="error" variant="body2">
          Failed to load suggestions: {error}
        </Typography>
      )}

      {!loadingNearby && nearbyPlaces.length === 0 && !error && (
        <Typography variant="body2" className="text-gray-500 italic">
          No nearby attractions found
        </Typography>
      )}

      <Swiper
        slidesPerView={2}
        spaceBetween={30}
        modules={[Pagination]}
        className="mySwiper w-full max-h-36"
      >
        {nearbyPlaces.map((nearbyPlace) => (
          <SwiperSlide key={nearbyPlace.place_id}>
            <div className="flex border-2  rounded-lg border-gray-200  bg-gray-50 gap-2 items-center">
              <div className="grid grid-cols-12 space-x-2 max-h-36 h-32">
                <div className="col-span-4 h-full">
                  {nearbyPlace.photos?.[0] ? (
                    <img
                      className="h-full w-full rounded-s-lg text-black text-sm font-light object-cover"
                      src={getPlacePhotoUrl(nearbyPlace.photos[0].getUrl())}
                      alt={nearbyPlace.name}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Place className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="col-span-8 flex flex-col justify-between p-2">
                  <div>
                    <h2 className="text-sm text-black font-medium line-clamp-1">
                      {nearbyPlace.name}
                    </h2>

                    <div className="flex items-center mt-1">
                      {nearbyPlace.rating && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-1 text-black">
                            {nearbyPlace.rating}
                          </span>
                          <span className="text-yellow-500">★</span>
                          {nearbyPlace.user_ratings_total && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({nearbyPlace.user_ratings_total})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {/* {nearbyPlace.types && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {nearbyPlace.types
                          .filter(
                            (type) =>
                              !["establishment", "point_of_interest"].includes(
                                type
                              )
                          )
                          .slice(0, 2)
                          .map((type, i) => (
                            <Chip
                              key={i}
                              label={type.replace("_", " ")}
                              size="small"
                              variant="outlined"
                              className="text-xs py-0 px-1 h-5"
                            />
                          ))}
                      </div>
                    )} */}
                  </div>
                  <div>
                    <Button
                      className="p-0 text-black"
                      onClick={() => onAddPlace(nearbyPlace.place_id || "")}
                      startIcon={<Add />}
                    >
                      Add to trip
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {nearbyPlaces.length > 0 && (
        <Button
          variant="text"
          size="small"
          className="mt-2"
          component={Link}
          to={`https://www.google.com/maps/search/?api=1&query=attractions+in+${encodeURIComponent(
            place?.displayName || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View more places
        </Button>
      )}
    </div>
  );
};
export default PlaceSuggestion;
