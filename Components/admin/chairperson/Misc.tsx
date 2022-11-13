import {
  Flex,
  Box,
  Text,
  ChakraComponent,
  Button,
  Badge,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { FaUser } from "react-icons/fa";
import { IconType } from "react-icons/lib";

type CardProps = {
  Avatar: IconType;
  heading: string;
  value: number;
  color: string;
};
const MyCard: React.FC<CardProps> = ({ Avatar, heading, value, color }) => {
  return (
    <Flex
      shadow="sm"
      bg="white"
      minWidth={["80vw", "80vw", "15rem"]}
      minHeight="8rem"
      alignItems={"center"}
      gap={4}
      rounded="md"
      _hover={{ shadow: "lg", transition: "all 500ms ease-in-out" }}
      padding={3}
      position="relative"
    >
      <Flex
        padding={3}
        bg={color}
        align={"center"}
        justifyContent="center"
        ml={2}
        rounded="md"
      >
        <Avatar color={"white"} fontSize={"1.2rem"} />
      </Flex>
      <Flex direction="column">
        <Box>
          <Text fontWeight={"normal"} color="muted">
            {heading}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xl" fontWeight={"bolder"} color={color}>
            {value}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
export default MyCard;
