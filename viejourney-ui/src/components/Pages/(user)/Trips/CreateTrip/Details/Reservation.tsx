import {
  AttachFile,
  EmojiTransportation,
  Explore,
  Hotel,
  MoreHoriz,
  RestaurantMenu,
  TransferWithinAStation,
} from "@mui/icons-material";
import { Chip, Divider, IconButton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import {
  ReservationNotes,
  ReservationPlaces,
  ReservationTransits,
} from "./elements";
const Reservation: React.FC = () => {

  const reservationItems = [
    { icon: <TransferWithinAStation />, label: "Transit" },
    { icon: <Hotel />, label: "Lodging" },
    { icon: <RestaurantMenu />, label: "Restaurant" },
    { icon: <AttachFile />, label: "Attachment" },
    { icon: <MoreHoriz />, label: "Others", disabled: true },
  ];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section className="bg-white p-4 rounded-lg  lg:px-10">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 lg:col-span-9 bg-neutral-100 p-4 rounded-lg">
          <h1 className="text-base font-semibold text-dark-900">
            Reservations and attachments
          </h1>
          <ul className="flex justify-between">
            {reservationItems.map((item, index) => (
              <li key={index} className="flex flex-col items-center ">
                <IconButton disabled={item.disabled}>{item.icon}</IconButton>
                <p className="text-sm">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 lg:col-span-3 bg-neutral-100 p-4 rounded-lg flex flex-col  justify-between">
          <h1 className="text-base font-semibold text-dark-900">Budgeting</h1>
          <data>0,00 US$</data>
          <Link
            to={"/trip/create/details/"}
            className="no-underline font-semibold text-dark-700 text-sm cursor-pointer hover:text-dark-500"
          >
            View details
          </Link>
        </div>
      </div>
      <ReservationNotes state={{ handleClick, handleClose, anchorEl }} />
      {/* Transits */}
      <Divider textAlign="left">
        <Chip
          icon={<EmojiTransportation />}
          label="Transits"
          className="font-semibold"
        />
      </Divider>
      <ReservationTransits />
      <Divider textAlign="left">
        <Chip
          icon={<Explore />}
          label="Places to Visit"
          className="font-semibold"
        />
      </Divider>
      <ReservationPlaces />
    </section>
  );
};

export default Reservation;
