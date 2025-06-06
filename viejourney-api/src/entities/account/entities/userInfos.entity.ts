import mongoose from "mongoose";
import { Asset } from "./asset.entity";

export class UserInfos {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    fullName: string;
    dob: Date;
    phone: string;
    address: string;
    avatar: Asset;

  }