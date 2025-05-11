import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "./types";

export const LanguageSimple: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 12H21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 3C14.5013 5.73835 15.9228 8.81803 16 12C15.9228 15.182 14.5013 18.2616 12 21C9.49872 18.2616 8.07725 15.182 8 12C8.07725 8.81803 9.49872 5.73835 12 3Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
