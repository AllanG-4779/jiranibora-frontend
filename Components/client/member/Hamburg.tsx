import {
  Flex,
  Heading,
  Text,
  Icon,
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";

import { BiSave } from "react-icons/bi";
import { FaLock, FaHistory, FaArrowLeft, FaUser } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { IoLogoAngular, IoMdClose } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/router";
import { Logout } from "@mui/icons-material";
import { signOut } from "next-auth/react";

const HamburgMenu = (props: any) => {
  const router = useRouter();
  // active link
  function checkActive(arg0: string) {
    if (router.pathname === arg0) {
      return true;
    } else {
      return false;
    }
  }
  const { open, before, setOpen } = props;
  return (
    <>
      {" "}
      <Flex
        width={open ? "70%" : "20%"}
        height={"100%"}
        position={"absolute"}
        left={open ? 0 : -600}
        transition="all 500ms ease-in-out"
        top={open ? 0 : 0}
        bg="#0F1419"
        color={"#fff"}
        display={["flex", "flex", "flex", "none"]}
        direction={"column"}
        shadow="md"
        fontSize={"large"}
        zIndex={200}
        justifyContent="space-between"
      >
        <Flex direction="column">
          <Heading fontFamily={"logo"} fontSize="1.8rem" mt={4} ml={"0.9em"}>
            JiraniBora
          </Heading>
          <Box
            alignSelf={"flex-end"}
            top={4}
            onClick={() => setOpen(false)}
            position="absolute"
          >
            <IoMdClose fontSize="2rem" color="white" />
          </Box>
          {/* Navbar items */}
          <Flex as="nav" direction="column" mt={20} className="sidebar" gap={5}>
            <Flex
              className={
                checkActive("/client/my")
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              _before={checkActive("/client/my") ? before : {}}
            >
              <ChakraLink className="sidebar-icon" mt={2}>
                <Icon as={FiHome}></Icon>
              </ChakraLink>
              <Link className="sidebar-text" href={"/client/my"} passHref>
                <a>Dashboard</a>
              </Link>
            </Flex>
            <Flex
              className={
                checkActive("/client/contribution")
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              _before={checkActive("/client/contribution") ? before : {}}
            >
              <ChakraLink className="sidebar-icon">
                <Icon as={BiSave}></Icon>
              </ChakraLink>
              <Link
                className="sidebar-text"
                href="/client/contribution"
                passHref
              >
                <a>Contributions</a>
              </Link>
            </Flex>
            <Flex
              className={
                checkActive("/client/loan")
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              _before={checkActive("/client/loan") ? before : {}}
            >
              <ChakraLink className="sidebar-icon">
                <Icon as={FaLock}></Icon>
              </ChakraLink>
              <Link className="sidebar-text" href="/client/loan" passHref>
                <a>Loan Statements</a>
              </Link>
            </Flex>
            <Flex
              className={
                checkActive("/client/transaction")
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              _before={checkActive("/client/transaction") ? before : {}}
            >
              <ChakraLink className="sidebar-icon">
                <Icon as={FaHistory}></Icon>
              </ChakraLink>
              <Link
                className="sidebar-text"
                href="/client/transaction"
                passHref
              >
                <a>Transaction History</a>
              </Link>
            </Flex>
            <Flex
              className={
                checkActive("/client/profile")
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              _before={checkActive("/client/profile") ? before : {}}
            >
              <ChakraLink className="sidebar-icon">
                <Icon as={FaUser}></Icon>
              </ChakraLink>
              <Link className="sidebar-text" href="/client/profile" passHref>
                <a>Profile</a>
              </Link>
            </Flex>
            <Flex
              justifySelf={"flex-end"}
              className={
                checkActive("/client/signout")
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              _before={checkActive("/client/signout") ? before : {}}
              onClick={async () => await signOut({ callbackUrl: "/login" })}
            >
              <ChakraLink className="sidebar-icon">
                <Icon as={Logout}></Icon>
              </ChakraLink>
              <Link className="sidebar-text" href="/client/signout" passHref>
                <a>logout</a>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default HamburgMenu;
