import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { IndexedMarkers } from "./IndexedMarker";
import { getColorForDate } from "../../../utils/handlers/utils";

interface Props {
  originPlaceId: string;
  destinationPlaceId: string;
  waypointsPlaceIds?: string[];
  travelMode?: google.maps.TravelMode;
  onRouteResult?: (result: google.maps.DirectionsResult) => void;
  fromDate?: string; // Optional date for the route
}

export function DirectionsRender({
  originPlaceId,
  destinationPlaceId,
  travelMode = google.maps.TravelMode.DRIVING,
  waypointsPlaceIds = [],
  fromDate = "",
  onRouteResult,
}: Props) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex] = useState(0);

  const selected = routes[routeIndex];

  useEffect(() => {
    if (!routesLibrary || !map) return;

    if (!directionsService) {
      setDirectionsService(new routesLibrary.DirectionsService());
    }
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !map || !originPlaceId || !destinationPlaceId)
      return;

    directionsService
      .route({
        origin: { placeId: originPlaceId },
        destination: { placeId: destinationPlaceId },
        travelMode,
        provideRouteAlternatives: false,
        waypoints: waypointsPlaceIds.map((placeId) => ({
          stopover: true,
          location: { placeId },
        })),
        optimizeWaypoints: false,
      })
      .then((response) => {
        const mainRoute = response.routes[0];
        setRoutes([mainRoute]);

        const path = mainRoute.overview_path;

        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }

        const polyline = new google.maps.Polyline({
          path,
          strokeColor: getColorForDate(fromDate),
          strokeOpacity: 0.8,
          strokeWeight: 5,
          zIndex: 1,
        });

        polyline.setMap(map);
        const infoWindow = new google.maps.InfoWindow({
          content: `<p class="date-view" style="color : ${getColorForDate(
            fromDate
          )}">Date: ${fromDate}</p>`,
        });

        polyline.addListener("mouseover", (e: google.maps.MapMouseEvent) => {
          infoWindow.setPosition(e.latLng);
          infoWindow.open(map);
        });

        polyline.addListener("mouseout", () => {
          infoWindow.close();
        });

        polylineRef.current = polyline;

        if (onRouteResult) onRouteResult(response);
      })
      .catch((error) => {
        console.error("Direction service error:", error);
      });
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [
    map,
    directionsService,
    originPlaceId,
    destinationPlaceId,
    waypointsPlaceIds,
    travelMode,
    fromDate,
  ]);

  return (
    <>
      <IndexedMarkers route={selected} />
    </>
  );
}
