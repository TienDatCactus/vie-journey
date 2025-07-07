import { Warning } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "swiper/css";
import "swiper/css/pagination";
import {
  CTDExpense,
  CTDHeader,
  CTDItinerary,
  CTDReservation,
} from "../../../../components/Pages/(user)/Trips";
import { DisconnectedDialog } from "../../../../components/Pages/(user)/Trips/CreateTrip/Details/elements";
import { TripLayout } from "../../../../layouts";
import { doGetTrip } from "../../../../services/api";
import { useSocket } from "../../../../services/context/socketContext";
import { useAuthStore } from "../../../../services/stores/useAuthStore";
import { useTripDetailStore } from "../../../../services/stores/useTripDetailStore";
import { useDirectionStore } from "../../../../services/stores/useDirectionStore";

const CreateTripDetails: React.FC = () => {
  const { user, info } = useAuthStore();
  const { setTrip } = useTripDetailStore();
  const { id } = useParams<{ id: string }>();
  const { setSocket, socketLoading, setSocketLoading, socketDisconnected } =
    useSocket();
  const [reason, setReason] = useState<string | null>(null);
  const {
    deleteNote,
    updateTransit,
    addNote,
    updateNote,
    addTransit,
    deleteTransit,
    addItinerary,
    updateItinerary,
    toggleEditItinerary,
    deleteItinerary,
    addExpense,
    updateExpense,
    deleteExpense,
    setTotalBudget,
  } = useTripDetailStore();
  const { addPlaceId } = useDirectionStore();

  useEffect(() => {
    setSocketLoading(true);

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
    setSocket(socket);
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setSocketLoading(false);
      socket.emit("ping", { hello: "server" });
    });
    socket.on("unauthorizedJoin", (data) => {
      console.warn(data.reason);
      setReason(data.reason);
    });
    socket.on("disconnect", (reason) => {
      if (!socket.active) {
        console.log("Disconnected:", reason);
      }
    });
    socket.on("onPlanItemAdded", (data) => {
      console.log(data);
      if (data.section == "notes") {
        addNote({
          id: data.item.id,
          content: data.item.text,
          by: data.addedBy,
          isEditing: false,
        });
      } else if (data.section == "transits") {
        addTransit({
          ...data.item.content,
          id: data.item.id,
        });
      } else if (data.section == "itineraries") {
        console.log("first itinerary added:", data);
        addPlaceId(data.item.place.placeId, data.item.date);
        addItinerary({
          ...data.item,
          place: {
            ...data.item.place,
            createdBy: data.addedBy,
          },
        });
      } else if (data.section == "budget") {
        console.log(data);
        setTotalBudget(Number(data.item));
      } else if (data.section == "expenses") {
        console.log("expense added:", data);
        addExpense({
          ...data.item,
          createdBy: data.addedBy,
        });
      }
    });

    socket.on("onPlanItemUpdated", (data) => {
      console.log(data);
      if (data.section == "notes") {
        updateNote(data.item.id, data.item.text);
      } else if (data.section == "transits") {
        updateTransit(data.item.id, data.item);
      } else if (data.section == "itineraries") {
        console.log("itinerary updated:", data);
        updateItinerary(data.item.id, {
          note: data.item.note,
          place: {
            ...data.item.place,
            createdBy: data.updatedBy,
          },
        });
      } else if (data.section == "expenses") {
        console.log("expense updated:", data);
        updateExpense(data.item.id, {
          ...data.item,
          createdBy: data.updatedBy,
        });
      }
    });

    socket.on("onPlanItemDeleted", (data) => {
      if (data.section == "notes") {
        deleteNote(data.itemId);
      } else if (data.section == "transits") {
        deleteTransit(data.itemId);
      } else if (data.section == "itineraries") {
        deleteItinerary(data.itemId);
      } else if (data.section == "expenses") {
        deleteExpense(data.itemId);
      }
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
  useEffect(() => {
    if (socketDisconnected == true) {
      console.log("Socket disconnected");
    }
  }, [socketDisconnected]);
  return (
    <>
      {socketLoading && (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-gray-200/50 z-50 text-center">
          <CircularProgress />
          <p>Initializing connections ...</p>
        </div>
      )}
      {socketDisconnected == true &&
        React.createElement(() => {
          const [shown, setShown] = React.useState(true);

          React.useEffect(() => {
            if (socketDisconnected == true && !shown) {
              setShown(true);
            }
          }, [socketDisconnected]);

          return !shown ? <DisconnectedDialog /> : null;
        })}
      {reason && (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-gray-200/50 z-50 text-center backdrop-blur-md">
          <Warning className="text-red-500 size-20" />
          <h1 className="text-2xl font-semibold">{reason}</h1>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setReason(null);
              window.location.href = "/";
            }}
          >
            Return to Home
          </Button>
        </div>
      )}
      <TripLayout>
        <CTDHeader />
        <CTDReservation />
        <CTDItinerary />
        <CTDExpense />
      </TripLayout>
    </>
  );
};

export default CreateTripDetails;
