import { Box } from "@chakra-ui/react";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box as="div" width={"100vw"} height="100vh">
      {children}
    </Box>
  );
};

export default Layout;
