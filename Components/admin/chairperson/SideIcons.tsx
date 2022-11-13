import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { RiHome8Fill } from "react-icons/ri";
import { MdPending } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export const SideBar = () => {
  return (
    <Flex
      direction="column"
      as="aside"
      display={["none", "flex"]}
      bg="side.900"
      height="calc(100vh - 3rem)"
      width={"4rem"}
      justifyContent="space-between"
    >
      <VStack as="ul" listStyleType={"none"} gap={5} mt={10}>
        <Box as="li">
          <RiHome8Fill color="white" fontSize={"1.3rem"} />
        </Box>
        <Box as="li">
          <FaThumbsUp color="white" fontSize={"1.3rem"} />
        </Box>
        <Box as="li">
          <FaThumbsDown color="white" fontSize={"1.3rem"} />
        </Box>
        <Box as="li">
          <MdPending color="white" fontSize={"1.3rem"} />
        </Box>
      </VStack>
      <VStack as="div" mb={"2rem"}>
        <FiLogOut color="white" fontSize={"1.3rem"} />
      </VStack>
    </Flex>
  );
};
