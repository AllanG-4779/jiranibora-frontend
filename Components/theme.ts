import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
export const theme = extendTheme({
  config,
  colors: {
    primary: {
      900: "#093D4C",
      800: "#0c5266",
      700: "#0f5a70",
    },
    muted: "#727686",
    success: "#287676",
    side: {
      900: "#657786",
    },
  },
  fonts: {
    body: `Poppins`,
    logo: `pacifico`,
  },
});
