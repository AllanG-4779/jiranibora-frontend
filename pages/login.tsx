import { Button, Flex, VStack } from "@chakra-ui/react";

import LoginForm from "../Components/client/Login/LoginForm";


const ClientLogin = () => {
  return (
    <Flex
      width="100vw"
      height={"100vh"}
      bg="#f2f2f2"
      alignItems={"center"}
      justifyContent="center"
    >
      <LoginForm />
      
    </Flex>
  );
};

export default ClientLogin;
