import { Warning } from "@mui/icons-material";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { useAssetsStore } from "../../../../services/stores/useAssets";
import { useBlogStore } from "../../../../services/stores/useBlogStore";

const CreateTripDetails: React.FC = () => {
  const { doGetUserAssets } = useAssetsStore();
  const { user, info } = useAuthStore();
  const { setTrip } = useTripDetailStore();
  const { id } = useParams<{ id: string }>();
  const {
    setSocket,
    socketLoading,
    setSocketLoading,
    setSocketDisconnected,
    socketDisconnected,
  } = useSocket();
  const [reason, setReason] = useState<string | null>(null);
  const { fetchRelatedBlogs, relatedBlogs } = useBlogStore();
  const location = useLocation();
  const isFromInvite = location.state?.invite === true;
  const [open, setOpen] = React.useState(isFromInvite);
  const handleClose = () => {
    setOpen(false);
  };
  const {
    deleteNote,
    updateTransit,
    addNote,
    updateNote,
    addTransit,
    deleteTransit,
    addItinerary,
    updateItinerary,

    deleteItinerary,
    addExpense,
    updateExpense,
    deleteExpense,
    setTotalBudget,
    addPlaceNote,
    deletePlaceNote,
    updatePlaceNote,

    handleGetPlanByTripId,
  } = useTripDetailStore();
  const { addPlaceId } = useDirectionStore();
  const navigate = useNavigate();
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
      setSocketDisconnected(false);
      socket.emit("ping", { hello: "server" });
    });
    socket.on("unauthorizedJoin", (data) => {
      console.warn(data.reason);
      setReason(data.reason);
    });
    socket.on("disconnect", (reason) => {
      if (!socket.active) {
        console.log("Disconnected:", reason);
        setSocketDisconnected(true);
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
      } else if (data.section == "places") {
        console.log("place added:", data);
        addPlaceNote({
          ...data.item,
          place: {
            ...data.item.place,
            createdBy: data.addedBy,
          },
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
      if (data.section == "notes") {
        updateNote(data.item.id, data.item.text);
      } else if (data.section == "transits") {
        updateTransit(data.item.id, data.item);
      } else if (data.section == "places") {
        updatePlaceNote(data.item.id, data.item.note, data.item.visited);
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
      } else if (data.section == "places") {
        deletePlaceNote(data.itemId);
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
      if (!id) return;

      try {
        const resp = await doGetTrip(id);
        if (resp) {
          setTrip(resp);
          await handleGetPlanByTripId();
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };
    fetchTripDetails();
  }, [id]);
  useEffect(() => {
    (async () => {
      if (!relatedBlogs) {
        await fetchRelatedBlogs();
      }
    })();
  }, [relatedBlogs, fetchRelatedBlogs]);
  useEffect(() => {
    if (socketDisconnected == true) {
      console.log("Socket disconnected");
    }
  }, [socketDisconnected]);
  useEffect(() => {
    (async () => {
      await doGetUserAssets();
    })();
  }, []);
  return (
    <>
      {isFromInvite && (
        <Backdrop
          open={open}
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-3xl font-semibold">Invitation Link</h1>
            <p className="text-center text-lg">
              You are invited to join a trip. Click continue to join the trip.
            </p>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Continue
            </Button>
          </div>
        </Backdrop>
      )}
      {socketLoading && (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-gray-200/50 z-50 text-center">
          <CircularProgress />
          <p>Initializing connections ...</p>
        </div>
      )}

      <DisconnectedDialog />

      {reason && (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-gray-200/50 z-50 text-center backdrop-blur-md">
          <Warning className="text-red-500 size-20" />
          <h1 className="text-2xl font-semibold">{reason}</h1>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setReason(null);
              navigate("/");
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
