import { create } from "zustand";
import { getLandingAssets } from "../api/asset";
import { doAddContentAsset, doGetUserContentAssets } from "../api";
import { Asset, LandingAssets } from "../../utils/interfaces";

interface AssetsState {
  landingAssets: LandingAssets;
  userAssets: Asset[];

  doGetAssets: () => Promise<void>;
  doGetUserAssets: () => Promise<void>;
  doAddUserAsset: (asset: File) => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set) => ({
  landingAssets: [],
  userAssets: [],

  doGetAssets: async () => {
    try {
      const response = await getLandingAssets();
      if (!response) {
        throw new Error("Failed to fetch assets");
      }
      set({ landingAssets: response });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách assets:", error);
    }
  },

  doGetUserAssets: async () => {
    try {
      const userAssets = await doGetUserContentAssets();
      if (!userAssets || !Array.isArray(userAssets)) {
        throw new Error("Failed to fetch user assets");
      }
      set({ userAssets: userAssets });
    } catch (error) {
      console.error(error);
    }
  },
  doAddUserAsset: async (asset: File) => {
    try {
      const resp = await doAddContentAsset(asset); // Adjust the API endpoint as needed
      if (resp) {
        set((state) => ({
          userAssets: [...state.userAssets, resp],
        }));
      }
    } catch (error) {
      console.error(error);
    }
  },
}));
