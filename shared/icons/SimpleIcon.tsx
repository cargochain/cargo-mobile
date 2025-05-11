import React from "react";
import Svg, { Circle } from "react-native-svg";
import { IconProps } from "./types";

export const SimpleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
};
