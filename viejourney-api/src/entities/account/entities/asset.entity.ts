import mongoose from "mongoose";

export class Asset {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: string;
    url: string;
    publicId: string;
  }