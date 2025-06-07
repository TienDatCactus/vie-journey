import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { TripLayout } from "../../../../layouts";

import {
  CTDExpense,
  CTDHeader,
  CTDItinerary,
  CTDReservation,
} from "../../../../components/Pages/(user)/Trips";
const CreateTripDetails: React.FC = () => {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  // const {
  //   control,
  //   formState: { errors, isValidating },
  //   register,
  // } = useForm();

  return (
    <TripLayout>
      <CTDHeader />
      <CTDReservation />
      <CTDItinerary />
      <CTDExpense />
    </TripLayout>
  );
};

export default CreateTripDetails;
