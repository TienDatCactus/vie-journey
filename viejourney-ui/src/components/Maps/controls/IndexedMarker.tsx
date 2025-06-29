import { AdvancedMarker, Marker, Pin } from "@vis.gl/react-google-maps";

interface IndexedMarkersProps {
  route: google.maps.DirectionsRoute | null;
}

export function IndexedMarkers({ route }: IndexedMarkersProps) {
  if (!route) return null;

  const markers: { position: google.maps.LatLngLiteral; index: number }[] = [];

  route.legs.forEach((leg, i) => {
    // Origin of this leg
    if (i === 0 && leg.start_location) {
      markers.push({ position: leg.start_location.toJSON(), index: 1 });
    }

    // Waypoint (end of each leg except final)
    if (leg.end_location) {
      markers.push({
        position: leg.end_location.toJSON(),
        index: i + 2,
      });
    }
  });
  console.log(markers);

  return (
    <>
      {markers.map((marker) => (
        <AdvancedMarker
          key={marker.index}
          position={marker.position}
          zIndex={-10}
        >
          <div className="p-1 rounded-full bg-white shadow-md">
            <Pin
              scale={1.4}
              background="#f44336"
              glyphColor="#ffffff"
              borderColor="#ffffff"
              glyph={marker.index.toString()}
            />
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
}
