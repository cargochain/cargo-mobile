import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Truck } from "./Truck";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: SymbolViewProps["name"] | "truck";
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Special case for the Truck icon
  if (name === "truck") {
    return <Truck size={size} color={color} style={style} />;
  }

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
