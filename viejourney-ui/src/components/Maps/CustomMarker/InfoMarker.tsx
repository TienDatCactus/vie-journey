import React, { FunctionComponent, useState } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import "./styles.css";

export interface PlaceData {
  uuid: string;
  details: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  };
  images: string[];
}

export const CustomAdvancedMarker: FunctionComponent<PlaceData> = (places) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const position = {
    lat: places.details.latitude,
    lng: places.details.longitude,
  };
  const renderCustomPin = () => {
    return (
      <>
        <div className="custom-pin">
          <button className="close-button">
            <span className="material-symbols-outlined"> close </span>
          </button>
        </div>

        <div className="tip" />
      </>
    );
  };

  return (
    <>
      <AdvancedMarker
        position={position}
        title={"AdvancedMarker with custom html content."}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`real-estate-marker ${clicked ? "clicked" : ""} ${
          hovered ? "hovered" : ""
        }`}
        onClick={() => setClicked(!clicked)}
      >
        {renderCustomPin()}
      </AdvancedMarker>
    </>
  );
};
