import {
  Flex,
  Text,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuIcon,
} from "@chakra-ui/react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { SiAbbrobotstudio } from "react-icons/si";
import { useContext } from "react";
import { ChairmanContext } from "./Context";
import { useSession } from "next-auth/react";

export const AppBar = () => {
  const {data:session, status} = useSession()
  const state = useContext(ChairmanContext);
  console.log("The menubar is " + state?.isOpen);
  return (
    <Flex
      as="nav"
      height={["4rem", "3rem"]}
      alignItems="center"
      fontFamily={"body"}
      bg="white"
      justifyContent={"space-between"}
      shadow="sm"
      position="fixed"
      right={0}
      left={0}
      zIndex={200}
    >
      <Flex
        as="div"
        color={"primary.900"}
        bg="primary.900"
        height="100%"
        display={["none", "none", "flex"]}
        alignItems="center"
        minWidth={"12rem"}
        justifyContent="center"
      >
        <Text
          fontSize={"1.3rem"}
          display="flex"
          fontWeight="bolder"
          color="white"
          gap={3}
          cursor="pointer"
        >
          <SiAbbrobotstudio fontSize={"2rem"} fontWeight="bolder" /> JiraniBora
        </Text>
      </Flex>
      <Flex
        as="div"
        height="100%"
        display={["flex", "flex", "none"]}
        alignItems="center"
        width={"4rem"}
        justifyContent="center"
      >
        <HiOutlineMenuAlt1
            cursor={"pointer"}
          fontSize={"2rem"}
          onClick={() => state?.setOpen(!state.isOpen)}
        />
      </Flex>
      <Flex as="div" mr={"1rem"} position="relative">
        <Avatar size={["md", "sm"]} src="https://i.imgur.com/pBcut2e.jpeg" />
        <Flex
          as={"div"}
          width="8px"
          height="8px"
          bg={status==="authenticated"?"green.400":"red.400"}
          rounded={"full"}
          position="absolute"
          bottom="0"
          
          right={-1}
        ></Flex>
      </Flex>
    </Flex>
  );
};
