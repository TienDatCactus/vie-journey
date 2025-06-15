import React, { useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { TripLayout } from "../../../../layouts";
import { io } from "socket.io-client";
import {
  CTDExpense,
  CTDHeader,
  CTDItinerary,
  CTDReservation,
} from "../../../../components/Pages/(user)/Trips";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../services/contexts/AuthContext";

const CreateTripDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  useEffect(() => {
    const socket = io("http://localhost:5000/trip", {
      transports: ["websocket"],
      auth: {
        tripId: `${id}`,
        email: user?.email,
      },
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("ping", { hello: "server" });
    });

    socket.on("disconnect", (reason) => {
      if (!socket.active) {
        console.log("Disconnected:", reason);
      }
    });

    socket.on("pong", (data) => {
      console.log("Received pong from server:", data);
    });
    return () => {
      socket.disconnect();
    };
  }, [id, user?.email]);
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
