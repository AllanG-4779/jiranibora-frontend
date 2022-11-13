import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import { theme } from "../Components/theme";

export default function Document() {
  return (
    <Html>
      <Head />
       <title>Jiranibora</title>
      <body>
        <ColorModeScript initialColorMode="light" />
        <Main />
        <div id="modal"></div>
        <NextScript />
      </body>
    </Html>
  );
}
