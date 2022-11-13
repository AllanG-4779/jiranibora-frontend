import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { IoMdClose, IoMdLogOut } from "react-icons/io";
import {signOut} from "next-auth/react";

const DropDownContainer = (props: any) => {
  const { visible, setToggle } = props;
  const router = useRouter();
  const baseurl = "/admin/treasurer";
  return (
    <>
      <Flex
        display={[
          visible ? "flex" : "none",
          visible ? "flex" : "none",
          "none",
          "none",
        ]}
        direction="column"
        position="absolute"
        top={"3rem"}
        bg="#fafafa "
        p={3}
        minWidth="100vw"
        height={"calc(100vh - 3rem)"}
        shadow="sm"
        transition="display 200ms ease"
      >
        <Box
          textAlign={"center"}
          border={`1px dashed transparent`}
          width="100%"
          p={3}
          _hover={{
            borderColor: "black",
            transition: "all 100ms ease-in-out",
          }}
          fontWeight={router.pathname === baseurl ? "bolder" : "normal"}
        >
          <Link passHref href={`${baseurl}`}>
            <a>Dashboard</a>
          </Link>
        </Box>
        <hr></hr>
        <Box
          textAlign={"center"}
          border={`1px dashed transparent`}
          width="100%"
          p={3}
          _hover={{
            borderColor: "black",
            transition: "all 100ms ease-in-out",
          }}
          fontWeight={router.pathname === baseurl ? "bolder" : "normal"}
        >
          <Link passHref href={`${baseurl}/contributions`}>
            <a>Contributions</a>
          </Link>
        </Box>
        <hr></hr>
        <Box
          textAlign={"center"}
          border={`1px dashed transparent`}
          width="100%"
          p={3}
          _hover={{
            borderColor: "black",
            transition: "all 100ms ease-in-out",
          }}
          fontWeight={router.pathname === baseurl ? "bolder" : "normal"}
        >
          <Link passHref href={`${baseurl}/loans`}>
            <a>Loans</a>
          </Link>
        </Box>
        <hr></hr>
        <Flex direction="column" gap={5}>
          <Flex position="absolute" bottom={10} alignItems="center" gap={3}>
            {/* <IoMdLogOut fontSize="2rem" />
            <Text>Logout</Text> */}
            <Text
              display={["flex", "none", "none"]}
              fontSize="1.5rem"
              fontFamily={"logo"}
              onClick={async ()=>{await signOut({callbackUrl: "/admin/login"})}}
            >
              Signout
            </Text>
          </Flex>
          {/* <Text  fontFamily="logo">
            JiraniBora
          </Text> */}
        </Flex>
      </Flex>
    </>
  );
};
export default DropDownContainer;
