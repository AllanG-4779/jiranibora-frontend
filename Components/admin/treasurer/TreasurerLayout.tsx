import {
  Avatar,
  Badge,
  Box,
  VStack,
  Flex,
  Spinner,
  Text,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverArrow,
  PopoverBody,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import DropDownContainer from "./DropDownComponent";
import { checkAuthStatusAndReturnToken } from "../../../Commons";
import { getSession, signOut } from "next-auth/react";
import jwtDecode from "jwt-decode";
import { backendJWT, sessionType } from "../../types";

const TreasurerLayout = (props: any) => {
  const { children } = props;
  const baseurl = "/admin/treasurer";
  const router = useRouter();
  const [showNav, setShowNav] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<sessionType | null>(null);

  useEffect(() => {
    checkAuthStatusAndReturnToken(router, "TRE").then(async (result) => {
      if (result) {
        setAuthToken(result);
        const user = (await getSession()) as sessionType;
        if (user) {
          setUser(user);
        }
      } else await router.push("/admin/login");
    });
    setTimeout(() => setLoading(false), 10000);
  }, [authToken, router]);

  return (
    <>
      {loading ? (
        <VStack h={"100vh"} w={"100vw"} justifyContent={"center"}>
          <Spinner />
        </VStack>
      ) : (
        <Flex h="100vh" direction="column" bg="#f2f2f2" overflow="auto">
          {/* To navigation bar */}
          <Flex
            bg="twitter.600"
            minHeight={"3rem"}
            as="nav"
            alignItems={"center"}
            direction={["row-reverse", "row", "row"]}
            justifyContent="space-between"
            shadow={"md"}
          >
            <Box fontFamily="logo" ml={3} display={["none", "flex", "flex"]}>
              <Link href={baseurl} passHref>
                <a
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  JiraniBora
                </a>
              </Link>
            </Box>
            <Flex
              color="white"
              minHeight="inherit"
              mr={[2, 4, 5, 8]}
              alignItems="center"
              justifyContent={"flex-end"}
              display={["none", "none", "flex"]}
              maxWidth={"60%"}
              fontSize={".9rem"}
              gap={[3, 4, 5, 8, 10]}
            >
              <Box
                border={`1px dashed transparent`}
                p={2}
                _hover={{
                  borderColor: "white",
                  transition: "all 100ms ease-in-out",
                }}
                fontWeight={router.pathname === baseurl ? "bolder" : "normal"}
              >
                <Link passHref href={`${baseurl}`}>
                  <a>Dashboard</a>
                </Link>
              </Box>
              <Box
                border={`1px dashed transparent`}
                p={2}
                _hover={{
                  borderColor: "white",
                  transition: "all 100ms ease-in-out",
                }}
                fontWeight={
                  router.pathname === `${baseurl}/loans` ? "bolder" : "normal"
                }
              >
                <Link passHref href={`${baseurl}/loans`}>
                  <a>Loans</a>
                </Link>
              </Box>
              <Box
                border={`1px dashed transparent`}
                p={2}
                _hover={{
                  borderColor: "white",
                  transition: "all 100ms ease-in-out",
                }}
                fontWeight={
                  router.pathname === `${baseurl}/contributions`
                    ? "bolder"
                    : "normal"
                }
              >
                <Link passHref href={`${baseurl}/contributions`}>
                  <a>Contributions</a>
                </Link>
              </Box>
              <Box
                onClick={() => setShowNav(false)}
                border={`1px dashed transparent`}
                p={2}
                _hover={{
                  borderColor: "white",
                  transition: "all 100ms ease-in-out",
                }}
                fontWeight={
                  router.pathname === `${baseurl}/members` ? "bolder" : "normal"
                }
              >
                <Link passHref href={`${baseurl}/members`}>
                  <a>Members</a>
                </Link>
              </Box>
            </Flex>
            <Popover>
              <PopoverTrigger>
                <Box
                  display="flex"
                  gap={2}
                  mx={[2, 3, 5, 8]}
                  cursor={"pointer"}
                >
                  <Avatar size="sm" />
                  <Box>
                    <Text
                      color="white"
                      fontSize=".7rem"
                      letterSpacing={"1px"}
                      fontWeight="bolder"
                    >
                      {user !== null && user.user.fullName}
                    </Text>
                    <Text color="#fafafa" fontSize=".7rem">
                      <Text colorScheme="blue"> Treasurer</Text>
                    </Text>
                  </Box>
                </Box>
              </PopoverTrigger>
              <PopoverContent width={"120px"} textAlign={"center"}>
                <PopoverArrow />

                <PopoverHeader></PopoverHeader>
                <PopoverBody>
                  <Button
                    width="100%"
                    size={"sm"}
                    colorScheme={"twitter"}
                    onClick={async () => {
                      await signOut({ callbackUrl: "/admin/login" });
                    }}
                  >
                    {" "}
                    Logout{" "}
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <Box
              display={["flex", "flex", "none", "none"]}
              mx={[2, 3, 5, 8]}
              onClick={() => setShowNav(!showNav)}
            >
              {!showNav ? (
                <IoMdMenu color="white" fontSize="2rem" />
              ) : (
                <IoMdClose color="white" fontSize="2rem" />
              )}
            </Box>
          </Flex>
          <Flex>
            {/* Content */}
            <Flex
              width={["99%", "95%", "90%", "80%"]}
              mx="auto"
              mt={[4, 6, 8, 10]}
            >
              {children}
            </Flex>
          </Flex>
          <DropDownContainer visible={showNav} setToggle={setShowNav} />
        </Flex>
      )}
    </>
  );
};
export default TreasurerLayout;
