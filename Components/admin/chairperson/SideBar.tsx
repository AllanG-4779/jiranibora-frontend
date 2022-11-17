import { Box, Flex, HStack, VStack, Text } from "@chakra-ui/react";
import { FaThumbsDown, FaThumbsUp, FaUser } from "react-icons/fa";
import { RiHome8Fill } from "react-icons/ri";
import { MdPending } from "react-icons/md";
import { FiLogOut, FiVolumeX } from "react-icons/fi";
import { IoIosPersonAdd } from "react-icons/io";
import { useContext } from "react";
import { ChairmanContext } from "./Context";
import { useRouter } from "next/router";
import Link from "next/link";
import { signOut } from "next-auth/react";

export const SideBar = () => {
  const router = useRouter();

  // const state = useContext(ChairmanContext);

  return (
    <Flex
      direction="column"
      as="aside"
      display={["none", "none", "flex"]}
      bg="primary.900"
      height="calc(100vh - 3rem)"
      width={"12rem"}
      justifyContent="space-between"
      shadow="sm"
      position="fixed"
      top=" 3rem"
      zIndex={100}
    >
      <Flex
        as="ul"
        direction="column"
        listStyleType={"none"}
        gap={2}
        mt={10}
        color="#d3d3d3"
        ml={3}
        fontSize="sm"
      >
        <Flex
          as="li"
          gap={3}
          padding={2}
          className={
            router.pathname == "/admin/chair/dashboard" ? "active" : ""
          }
          width="90%"
        >
          <RiHome8Fill color="white" fontSize={"1.3rem"} />
          <Link passHref href="/admin/chair/dashboard">
            <a>Home</a>
          </Link>
        </Flex>
        <Flex
          as="li"
          gap={3}
          padding={2}
          width="90%"
          className={router.pathname.includes("application") ? "active" : ""}
        >
          <IoIosPersonAdd color="white" fontSize={"1.3rem"} />
          <Link passHref href="/admin/chair/applications">
            <a>Applications</a>
          </Link>
        </Flex>
        <Flex
          as="li"
          gap={3}
          padding={2}
          width="90%"
          className={router.pathname.includes("appr") ? "active" : ""}
        >
          <FaThumbsUp color="white" fontSize={"1.3rem"} />
          <Link passHref href="/admin/chair/appr">
            <a>Approved</a>
          </Link>
        </Flex>
        <Flex
          as="li"
          gap={3}
          padding={2}
          width="90%"
          className={router.pathname.includes("dis") ? "active" : ""}
        >
          <FaThumbsDown color="white" fontSize={"1.3rem"} />
          <Link passHref href="/admin/chair/dis">
            <a>Disapproved</a>
          </Link>
        </Flex>
        <Flex
          as="li"
          gap={3}
          padding={2}
          width="90%"
          className={router.pathname.includes("user_role") ? "active" : ""}
        >
          <FaUser color="white" fontSize={"1.3rem"} />
          <Link passHref href="/admin/chair/user_role">
            <a>Roles</a>
          </Link>
        </Flex>
      </Flex>
      <Flex
        ml={3}
        as="div"
        cursor={"pointer"}
        mb={"2rem"}
        gap={3}
        color="white"
        padding={2}
        onClick={async () => {
          await signOut({ callbackUrl: "/admin/login" });
        }}
      >
        <FiLogOut color="white" fontSize={"1.3rem"} />
        <Text>Logout</Text>
      </Flex>
    </Flex>
  );
};
