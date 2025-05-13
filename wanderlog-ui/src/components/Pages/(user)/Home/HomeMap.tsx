import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import "@openmapvn/openmapvn-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
const HomeMap = () => {
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
    map.addControl(new maplibregl.FullscreenControl());
    return () => map.remove();
  }, []);

  return (
    <div className="w-full max-w-[1000px] pb-10">
      <div
        ref={mapContainerRef}
        className="w-full h-[300px] mb-4 rounded-lg relative "
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
      </div>
    </div>
  );
};

export default HomeMap;
