import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import Map from "../../../Maps/Map";

const HomeMap = () => {
  return (
    <div className="w-full max-w-[1200px] pb-10">
      <h1 className="text-[1.875rem] font-bold">Map</h1>
      <div className="w-full h-[300px] mb-4 rounded-lg relative">
        <Map
          position="relative"
          defaultZoom={20}
          detailed={false}
          className="w-full h-full rounded-lg"
        />
        {/* Stats overlay */}
        <div className="z-20 absolute top-2 right-2 p-2 flex items-center gap-2 bg-gray-400/10 rounded-md bg-clip-padding backdrop-blur-sm border border-gray-100">
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
