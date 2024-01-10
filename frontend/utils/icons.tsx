import GenericTokenIcon from "@/assets/svg/files/generic-token.svg";
import { IconType, IconTypeEnum, symbolIconDict } from "@/const";

export const getAssetIcon = (type: IconType, symbol?: string, logo?: string) => {
  const sizeClass = getSizeClassByIconType(type);
  const iconSrc = getIconSrc(logo, symbol);

  return <img className={sizeClass} src={iconSrc} alt="" />;
};

const getSizeClassByIconType = (type: IconType): string => {
  switch (type) {
    case IconTypeEnum.Enum.FILTER:
      return "w-6 h-6";
    case IconTypeEnum.Enum.ASSET:
      return "w-8 h-8";
    default:
      return "w-10 h-10";
  }
};

const getIconSrc = (logo?: string, symbol?: string): string => {
  if (logo && logo !== "") {
    return logo;
  } else if (symbol) {
    return symbolIconDict[symbol] || GenericTokenIcon;
  } else {
    return GenericTokenIcon;
  }
};