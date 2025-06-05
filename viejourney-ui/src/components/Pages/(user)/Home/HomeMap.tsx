import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { usePlaceSearch } from "../../../../services/contexts/PlaceSearchContext";
import Map from "../../../Maps/Map";
import { POIData } from "../../../Maps/types";

const HomeMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { selectedPlace } = usePlaceSearch();

  // Handle POI click if needed
  const handlePOIClick = (poiData: POIData) => {
    console.log("POI clicked:", poiData);
    // Add any additional handling logic here
  };

  // Pan and zoom to selected place when it changes
  useEffect(() => {
    console.log(selectedPlace);
    if (selectedPlace?.location && mapRef.current) {
      mapRef.current.panTo(selectedPlace.location);
      mapRef.current.setZoom(15);
    }
  }, [selectedPlace]);

  return (
    <div className="w-full max-w-[1200px] pb-10">
      <h1 className="text-[1.875rem] font-bold">Map</h1>
      <div className="w-full h-[300px] mb-4 rounded-lg relative">
        <Map
          containerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
          }}
          defaultCenter={{ lat: 21.0278, lng: 105.8342 }}
          defaultZoom={10}
          showMapTypeControl={false}
          disableDefaultUI={true}
          onPOIClick={handlePOIClick}
          streetViewControl={false}
          fullscreenControl={false}
          zoomControl={true}
          mapTypeControl={false}
          showDetailsControl={false}
        >
          {/* Show marker for selected place */}
          {selectedPlace?.location && (
            <AdvancedMarker
              position={selectedPlace.location}
              title={selectedPlace.displayName}
              zIndex={1000}
            >
              <Pin
                scale={1.3}
                background="#1976d2"
                glyphColor="#ffffff"
                borderColor="#0d47a1"
              />
            </AdvancedMarker>
          )}
        </Map>

        {/* Stats overlay */}
        <div className="z-20 absolute top-[2px] left-[2px] p-2 flex items-center gap-2 bg-gray-400/10 rounded-md bg-clip-padding backdrop-blur-sm border border-gray-100">
          <div className="text-center">
            <p className="text-[16px] my-0">1</p>
            <h1 className="my-0 text-[16px]">Country</h1>
          </div>
          <div className="text-center">
            <p className="text-[16px] my-0">1</p>
            <h1 className="my-0 text-[16px]">City & Region</h1>
          </div>
          <div className="flex items-center">
            <MilitaryTechIcon />
            <h1 className="text-[20px]">Novice</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMap;
