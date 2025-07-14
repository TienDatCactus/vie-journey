import { ImageData } from "../../utils/interfaces/asset";
import http from "../axios/index";
import { ASSET } from "./url";

export const uploadImg = async (file: File): Promise<ImageData> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await http.post(ASSET.UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const getLandingAssets = async () => {
  try {
    const res = await http.get(ASSET.LANDING);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};



