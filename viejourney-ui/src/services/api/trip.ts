import { ITrip } from "../../utils/interfaces/trip";
import http from "../axios";
import { TRIP } from "./url";

export const getTripList = async () : Promise<ITrip[]> => {
  const res = await http.get(`${TRIP.GET_TRIP}`);
  return res.data;
}