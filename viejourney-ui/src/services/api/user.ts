import { IUserInfoUpdate } from "../../utils/interfaces";
import http from "../axios/index";
import { USER } from "./url";

export const updateUserInfo = async (id: string, data: IUserInfoUpdate) => {
  const res = await http.patch(`${USER.UPDATE}/${id}`, data);
  return res.data;
};

export const editUserAvatar = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("avatar", file);
  const res = await http.post(USER.EDIT_AVATAR, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
