import { create } from "zustand";
import { getLandingAssets } from "../api/asset";

interface Asset {
  id: string;
  type: string;
  url: string;
}

interface AssetsState {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  clearAssets: () => void;
  filterAssets: (type: string) => void;
  doGetAssets: () => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set) => ({
  assets: [],
  addAsset: (asset) =>
    set((state) => ({
      assets: [...state.assets, asset],
    })),
  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
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
}));
