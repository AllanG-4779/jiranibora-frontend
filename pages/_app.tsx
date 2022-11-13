import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { theme } from "../Components/theme";
import "@fontsource/poppins/";
import "@fontsource/pacifico/"

import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";

type ComponentWithPagedLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<{ children: ReactNode }>;
  };
};

function MyApp({ Component, pageProps }: ComponentWithPagedLayout) {
  return (
    <>
      <NextNProgress />
      <SessionProvider>
        <ChakraProvider theme={theme}>
          {Component.PageLayout ? (
            <Component.PageLayout>
              <Component {...pageProps} />
            </Component.PageLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </ChakraProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
