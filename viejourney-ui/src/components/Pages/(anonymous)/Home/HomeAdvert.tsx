import React from "react";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
const HomeAdvert: React.FC = () => {
  const topValues: Array<{
    icons: React.ReactNode;
    title: string;
    sub: string;
  }> = [
    {
      icons: <AirplaneTicketOutlinedIcon />,
      title: "Airport pickup",
      sub: "We provide escort from the airport to the hotel",
    },
    {
      icons: <AccountBalanceWalletOutlinedIcon />,
      title: "Easy booking",
      sub: "Quick and easy booking of tours for upcoming dates",
    },

    {
      icons: <Groups2OutlinedIcon />,
      title: "Best tour guide",
      sub: "Our best tour guide is ready to guide your trip",
    },
    {
      icons: <DiscountOutlinedIcon />,
      title: "Lots of promos",
      sub: "Various promotions and drawings of tours",
    },
  ];
  return (
    <div className="max-w-[1000px] py-10">
      <div className="text-center">
        <h1 className="my-4 font-bold text-6xl">Top values for you</h1>
        <p className="text-neutral-800 text-lg">
          Discover top-rated tours, activities, and attraction tickets
        </p>
      </div>
      <ul className="flex list-none *:text-center py-6">
        {!!topValues.length &&
          topValues?.map((value, index) => (
            <li key={index}>
              <div className="flex justify-center">
                <div className="bg-neutral-100 px-2 py-4 w-1/4 shadow-md rounded-full flex items-center justify-center">
                  {value?.icons}
                </div>
              </div>
              <div className="my-4">
                <h1 className="text-base my-0">{value?.title}</h1>
                <p className="text-neutral-600 text-sm my-0">{value?.sub}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default HomeAdvert;
