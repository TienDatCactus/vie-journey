import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { Button, Tab, Tabs } from "@mui/material";
import maplibregl from "maplibre-gl";
import React, { useEffect, useRef } from "react";
import { DashboardLayout, MainLayout } from "../../../layouts";
import {
  DashboardGuides,
  DashboardPlans,
} from "../../../components/Pages/(user)/Dashboard";

const Dashboard: React.FC = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current as unknown as HTMLElement,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${
        import.meta.env.VITE_MAPTILER_KEY
      }`,
      center: [105.8342, 21.0278],
      zoom: 10,
    });
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => map.remove();
  }, []);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <MainLayout>
      <DashboardLayout>
        <div
          ref={mapContainerRef}
          className="w-full h-[200px] rounded-lg relative"
        >
          <div className="z-10 absolute top-[2px] left-[2px] p-2 flex items-center gap-2 bg-gray-400/10 rounded-md bg-clip-padding  backdrop-blur-sm border border-gray-100">
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
              <h1 className="text-[20px]">Novice </h1>
            </div>
          </div>
          <Button
            className="z-10 absolute bottom-1 left-1 bg-gray-400/10 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm opacity- border border-gray-100 text-black"
            variant="contained"
          >
            Add visited places
          </Button>
        </div>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          className="p-0 mb-2"
        >
          <Tab label="Trip plans" />
          <Tab label="Guides" />
        </Tabs>
        {value === 0 && <DashboardPlans value={value} index={0} />}
        {value === 1 && <DashboardGuides value={value} index={1} />}
      </DashboardLayout>
    </MainLayout>
  );
};

export default Dashboard;
