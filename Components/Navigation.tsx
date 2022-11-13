import { Flex, Heading } from "@chakra-ui/react";
import { SiAbbrobotstudio } from "react-icons/si";

const Header = () => {
  return (
    <Flex direction={"column"} alignItems="center">
      <SiAbbrobotstudio fontSize={30} color={"primary.900"}/>
      <Heading fontWeight={"bold"} fontSize={["2rem"]} color="primary.900">
        JiraniBora
      </Heading>
    </Flex>
  );
};
export default Header;
