import { Add, Place } from "@mui/icons-material";
import {
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  CardActionArea,
  IconButton,
} from "@mui/material";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { getPlacePhotoUrl } from "../../../../../../../utils/handlers/utils";
import { Itinerary } from "../../../../../../../services/stores/storeInterfaces";
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
      <Typography variant="subtitle1" className="font-medium mb-2">
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
            <Card className="flex">
              <div className="grid lg:grid-cols-3 grid-cols-1 max-h-36 h-32">
                <div className="lg:col-span-1 col-span-3 h-full">
                  {nearbyPlace.photos?.[0] ? (
                    <CardMedia
                      component="img"
                      className="h-full w-full object-cover"
                      image={getPlacePhotoUrl(nearbyPlace.photos[0].getUrl())}
                      alt={nearbyPlace.name}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Place className="text-gray-400" />
                    </div>
                  )}
                </div>

                <CardContent className="lg:col-span-2 col-span-3 ">
                  <Typography
                    variant="subtitle2"
                    className="font-medium line-clamp-1"
                  >
                    {nearbyPlace.name}
                  </Typography>

                  <div className="flex items-center mt-1">
                    {nearbyPlace.rating && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-1">
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
                  {nearbyPlace.types && (
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
                  )}
                </CardContent>
              </div>
              <div className="w-fit h-fit my-auto rounded-full">
                <IconButton
                  onClick={() => onAddPlace(nearbyPlace.place_id || "")}
                >
                  <Add />
                </IconButton>
              </div>
            </Card>
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
