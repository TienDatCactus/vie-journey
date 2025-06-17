import { IUserInfoUpdate } from "../../utils/interfaces";
import http from "../axios/index";
import { USER } from "./url";



export const updateUserInfo = async (id: string, data: IUserInfoUpdate) => {

  const res = await http.patch(`${USER.UPDATE}/${id}`, data);
  return res.data;
};
