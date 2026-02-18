import { Dimensions, StyleSheet } from "react-native";

export const colors = {
  primary: "#23272A",
  secondary: "#2C2F33",
  secondary_200:"#40444B",
  muted:"#72767D",
  text: "#99AAB5",
  blurple: "#5865F2",
  danger: "#e00b00",
  warning: "#fae43c",
  success: "#57F287",
};

export const fontFamily = {
  poppins: "Poppins",
  poppins_semibold: "Poppins_Semibold",
  poppins_medium: "Poppins_Medium",
  poppins_bold: "Poppins_Bold",

};

const {width} = Dimensions.get("window")
export const isSmall = width < 360;
export const isPhone = width >= 360 && width < 600;
export const isTablet = width >= 600 && width < 900;
export const isLargeTablet = width >= 900;

const scale = (size:number) => (width/412) * size
export const clamp = (size:number,min:number,max:number)=>Math.min(Math.max(scale(size),min),max)

const font = {
  h1: { fontSize: clamp(48,44,52), lineHeight: clamp(44,40,48) },
  h2: { fontSize: clamp(28, 24, 32), lineHeight: clamp(36, 30, 40)},
  button: { fontSize: clamp(22, 18, 24), lineHeight: clamp(30, 26, 34) },
  body: { fontSize: clamp(16, 16, 18), lineHeight: clamp(28, 24, 32) },
  small: { fontSize: clamp(14, 12, 16), lineHeight: clamp(20, 18, 22) },
};

export const GlobalStyle = StyleSheet.create({
  poppins_h1: { fontFamily: fontFamily.poppins, ...font.h1 },
  poppins_h2: { fontFamily: fontFamily.poppins, ...font.h2 },
  poppins_button: { fontFamily: fontFamily.poppins, ...font.button },
  poppins_body: { fontFamily: fontFamily.poppins, ...font.body },
  poppins_small: { fontFamily: fontFamily.poppins, ...font.small },

  semibold_h1: { fontFamily: fontFamily.poppins_semibold, ...font.h1 },
  semibold_h2: { fontFamily: fontFamily.poppins_semibold, ...font.h2 },
  semibold_button: { fontFamily: fontFamily.poppins_semibold, ...font.button },
  semibold_body: { fontFamily: fontFamily.poppins_semibold, ...font.body },
  semibold_small: { fontFamily: fontFamily.poppins_semibold, ...font.small },

  medium_h1: { fontFamily: fontFamily.poppins_medium, ...font.h1 },
  medium_h2: { fontFamily: fontFamily.poppins_medium, ...font.h2 },
  medium_button: { fontFamily: fontFamily.poppins_medium, ...font.button },
  medium_body: { fontFamily: fontFamily.poppins_medium, ...font.body },
  medium_small: { fontFamily: fontFamily.poppins_medium, ...font.small },

  bold_h1: { fontFamily: fontFamily.poppins_bold, ...font.h1 },
  bold_h2: { fontFamily: fontFamily.poppins_bold, ...font.h2 },
  bold_button: { fontFamily: fontFamily.poppins_bold, ...font.button },
  bold_body: { fontFamily: fontFamily.poppins_bold, ...font.body },
  bold_small: { fontFamily: fontFamily.poppins_bold, ...font.small },
});
