import {
  Avatar,
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { checkAuthStatusAndReturnToken } from "../../../Commons";
import { signOut } from "next-auth/react";

let SecretaryLayout = (props: any) => {
  const { children } = props;
  const router = useRouter();
  const [authToken, setToken] = useState("");
  const active = {
    content: "''",
    backgroundColor: "white",
    padding: "1px",
    width: "80%",
    position: "absolute",
    bottom: 0,
  };
  const isActive = (url: string) => {
    return router.pathname === url;
  };
  useEffect(() => {
    checkAuthStatusAndReturnToken(router, "SEC")
      .then((success) => {
        if (success) setToken(success);
      })
      .catch((e) => console.log(e));
  }, [authToken]);
  return (
    <>
      <Flex h={"100vh"} overflow="auto" direction="column" bg="#f2f2f2">
        <Flex
          bg={"twitter.700"}
          color="white"
          as="nav"
          alignItems={"center"}
          justifyContent="space-between"
          minHeight={"3rem"}
          right={0}
        >
          <Box fontFamily={"logo"} flex={1} ml={3}>
            JiraniBora
          </Box>
          <Flex
            as={"ul"}
            mr="1rem"
            flex={2}
            justifyContent="flex-end"
            gap={3}
            fontSize=".8rem"
            alignItems={"center"}
            minHeight="100%"
          >
            <Box
              as={"li"}
              listStyleType={"none"}
              borderBottom={"1px solid transparent"}
              _before={isActive("/admin/secretary") ? active : {}}
              position="relative"
              p={3}
              height="100%"
            >
              <Link href={"/admin/secretary"}>
                <a>Dashboard</a>
              </Link>
            </Box>
            <Box
              as={"li"}
              listStyleType={"none"}
              borderBottom={"1px solid transparent"}
              _before={isActive("/admin/secretary/fines") ? active : {}}
              position="relative"
              p={3}
              height="100%"
            >
              <Link href={"/admin/secretary/fines"}>
                <a>Fines</a>
              </Link>
            </Box>
            <Box
              as={"li"}
              listStyleType={"none"}
              borderBottom="1px solid transparent"
              _before={isActive("/admin/secretary/meetings") ? active : {}}
              position="relative"
              p={3}
              height="100%"
            >
              <Link href={"/admin/secretary/meetings"}>
                <a>Meetings</a>
              </Link>
            </Box>
            <Popover>
              <PopoverTrigger>
                <Box as={"li"} listStyleType={"none"} ml={10}>
                  <Avatar size={"sm"} />
                </Box>
              </PopoverTrigger>

              <PopoverContent width={"150px"}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader></PopoverHeader>
                <PopoverBody>
                  <Button
                    width={"100%"}
                    size={"sm"}
                    colorScheme={"twitter"}
                    onClick={async () =>
                      await signOut({ callbackUrl: "/admin/login" })
                    }
                  >
                    Logout
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
        <Flex width={["97%", "95%", "90%", "80%"]} mx="auto" h={"full"}>
          {children}
        </Flex>
      </Flex>
    </>
  );
};
export default SecretaryLayout;
