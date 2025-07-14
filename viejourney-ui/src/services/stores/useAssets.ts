import { create } from "zustand";
import { getLandingAssets } from "../api/asset";
import { doAddContentAsset, doGetUserContentAssets } from "../api";
import { Asset } from "../../utils/interfaces";

interface AssetsState {
  assets: Asset[];
  userAssets: Asset[];
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  clearAssets: () => void;
  filterAssets: (type: string) => void;
  doGetAssets: () => Promise<void>;
  doGetUserAssets: () => Promise<void>;
  doAddUserAsset: (asset: File) => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set) => ({
  assets: [],
  userAssets: [],
  addAsset: (asset) =>
    set((state) => ({
      assets: [...state.assets, asset],
    })),
  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((asset) => asset._id !== id),
    })),
  clearAssets: () =>
    set(() => ({
      assets: [],
    })),
  filterAssets: (type: string) => {
    set((state) => ({
      assets: state.assets.filter((asset) => asset.type === type),
    }));
  },
  doGetAssets: async () => {
    try {
      const assets = await getLandingAssets(); // Adjust the API endpoint as needed
      if (!assets || !Array.isArray(assets)) {
        throw new Error("Failed to fetch assets");
      }
      set({ assets: assets });
    } catch (error) {
      console.error(error);
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
