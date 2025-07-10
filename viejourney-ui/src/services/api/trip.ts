import http from "../axios";
import { Trip } from "../stores/storeTypes";
import { TRIP } from "./url";

export const getTripList = async (): Promise<Trip[]> => {
  const res = await http.get(`${TRIP.GET_TRIP}`);
  return res.data;
};
