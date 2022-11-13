import React from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import { NextComponentType } from "next";

import LoginForm from "./LoginForm";
import OTPModal from "../HOC/OtpModal";

const Login: NextComponentType = () => {
  return (
    <Flex
      direction="column"
      height={"100vh"}
      width="100vw"
      justify="center"
      align="center"
      bg="#f2f2f2"
    >
      <Box
        bg="white"
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        shadow="lg"
        rounded="lg"
        padding={3}
      >
        <LoginForm />
      </Box>
    </Flex>
  );
};

export default Login;
