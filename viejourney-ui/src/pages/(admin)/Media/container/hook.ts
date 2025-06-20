import { useEffect, useState } from "react";
import {
  deleteAssetByPublicId,
  getAssetByType,
  updateAssetByPublicId,
} from "../../../../services/api/admin";
import {
  ASSET_TYPE,
  IAsset,
  IAssetType,
} from "../../../../utils/interfaces/admin";
import { useSnackbar } from "notistack";

function useHook() {
  const { enqueueSnackbar } = useSnackbar();

  const [listImg, setListImg] = useState<IAsset[]>();
  const [avatarLength, setAvatarLength] = useState<number>();
  const [bannerLength, setBannerLength] = useState<number>();
  const [contentLength, setContentLength] = useState<number>();

  const getListAsset = async (param: IAssetType) => {
    try {
      const res = await getAssetByType(param);
      if (res) setListImg(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const getLengthAsset = async () => {
    try {
      const avatarRes = await getAssetByType({
        type: ASSET_TYPE.AVATAR,
      });
      if (avatarRes) setAvatarLength(avatarRes.length);

      const bannerRes = await getAssetByType({
        type: ASSET_TYPE.BANNER,
      });

      if (bannerRes) setBannerLength(bannerRes.length);
      const contentRes = await getAssetByType({
        type: ASSET_TYPE.CONTENT,
      });
      if (contentRes) setContentLength(contentRes.length);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const updateAsset = async (
    file: File,
    publicId: string,
    type: "AVATAR" | "BANNER" | "CONTENT"
  ) => {
    try {
      const res = await updateAssetByPublicId({
        publicId: publicId,
        file: file,
      });

      if (res) {
        enqueueSnackbar("Updated image successful", {
          variant: "success",
        });
        getListAsset({
          type: type,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleTabChange = (type: "AVATAR" | "BANNER" | "CONTENT") => {
    getListAsset({
      type: type,
    });
  };

  const deleteAsset = async (
    publicId: string,
    type: "AVATAR" | "BANNER" | "CONTENT"
  ) => {
    try {
      const res = await deleteAssetByPublicId(publicId);
      if (res) {
        enqueueSnackbar("Delete image successful", {
          variant: "success",
        });
        getListAsset({
          type: type,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  useEffect(() => {
    const param = {
      type: ASSET_TYPE.AVATAR,
    };
    getListAsset(param);
    getLengthAsset();
  }, []);

  return {
    listImg,
    handleTabChange,
    contentLength,
    avatarLength,
    bannerLength,
    updateAsset,
    deleteAsset,
  };
}

export default useHook;
