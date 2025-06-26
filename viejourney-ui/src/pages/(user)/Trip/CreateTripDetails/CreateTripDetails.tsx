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
import { useAuthStore } from "../../../../services/stores/useAuthStore";
import { doGetTrip } from "../../../../services/api";
import { useTripDetailStore } from "../../../../services/stores/useTripDetailStore";

const CreateTripDetails: React.FC = () => {
  const { user, info } = useAuthStore();
  const { setTrip } = useTripDetailStore();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const socket = io("http://localhost:5000/trip", {
      transports: ["websocket"],
      auth: {
        tripId: `${id}`,
        user: {
          id: user?._id,
          email: user?.email,
          fullname:
            info?.fullName == null
              ? user?.email?.split("@")[0]
              : info?.fullName,
        },
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
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!id) {
        return;
      }
      const resp = await doGetTrip(id);
      if (resp) {
        setTrip(resp);
      }
    };
    fetchTripDetails();
  }, [id]);
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
