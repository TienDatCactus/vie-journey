export interface IAssetType {
  type: "AVATAR" | "BANNER" | "CONTENT";
}

export interface IQueryUpdate {
  publicId: string;
  file: File;
}

export interface IAsset {
  _id: string;
  userId: string;
  type: IAssetType;
  url: string;
  location: string;
  format: string;
  file_size: string;
  dimensions: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export enum ASSET_TYPE {
  AVATAR = "AVATAR",
  BANNER = "BANNER",
  CONTENT = "CONTENT",
}
