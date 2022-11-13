import { Box, Flex, Text } from "@chakra-ui/react";
import { Dispatch } from "react";
import { BiCheckCircle, BiError } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { RiCheckFill } from "react-icons/ri";

type alert = {
  type: string;
  message: string;
  size: number;
  setSize: Dispatch<React.SetStateAction<number>>;
};

const AlertBox = ({ message, type, size, setSize }: alert) => {
  return (
    <Box
      position={"absolute"}
      zIndex={1000}
      top={`${size}%`}
      transition="all 1s ease-in-out"
      display={ "flex"}
      right={"40%"}
      width={["97%", "90%", "80%", "35%"]}
      shadow="md"
      flexDir="column"
      p={3}
      rounded="md"
      bg={type == "success" ? "green.500" : "red.500"}
    >
      <Flex alignItems={"center"} gap={4}>
        {type == "success" ? (
          <FaCheckCircle color="white" fontSize={"1.8rem"} />
        ) : (
          <BiError color="white" size={"1.5rem"} />
        )}
        <Flex
          alignItems={"center"}
          justifyContent="space-between"
          width={"100%"}
        >
          <Text fontSize={".8rem"} color={"white"} fontWeight="bolder">
            {message}
          </Text>
          <MdClose
            onClick={() => setSize(-100)}
            cursor="pointer"
            fontSize="1.3rem"
            fontWeight={"bolder"}
            color="white"
          />
        </Flex>
      </Flex>
    </Box>
  );
};
export default AlertBox;
