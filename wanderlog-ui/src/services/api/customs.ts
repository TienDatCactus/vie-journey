import http from "../axios";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: import.meta.env.VITE_FOURSQUARE_CLIENT_ID,
  },
};

export const getPlaces = async (query: string) => {
  try {
    const resp = await http.get(
      `https://api.foursquare.com/v3/autocomplete?query=${query}`,
      options
    );
    if (resp.data) {
      console.log(resp.data);
      return resp.data;
    }
    return null;
  } catch (err) {
    console.error(err);
  }
};
