import { IAsset, IAssetType, IQueryUpdate } from "../../utils/interfaces/admin";
import http from "../axios/index";
import { ADMIN } from "./url";

export const getAssetByType = async (param: IAssetType): Promise<IAsset[]> => {
  const res = await http.get(ADMIN.GET_ASSET, { params: param });
  return res.data;
};

export const updateAssetByPublicId = async (data: IQueryUpdate) => {
  const formData = new FormData();
  formData.append("publicId", data.publicId);
  formData.append("file", data.file);

  const res = await http.post(ADMIN.UPDATE_ASSET, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
