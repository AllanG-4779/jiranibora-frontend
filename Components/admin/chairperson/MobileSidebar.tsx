import { Box, Flex, Text } from "@chakra-ui/react";
import { FaLessThanEqual, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { RiHome8Fill } from "react-icons/ri";
import { MdPending } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { IoIosPersonAdd, IoMdClose } from "react-icons/io";
import { useContext } from "react";
import { ChairmanContext } from "./Context";
import Link from "next/link";
import {signOut} from "next-auth/react";

const MobileSidebar = () => {
  const state = useContext(ChairmanContext);

  return (
    <Flex
      direction="column"
      as="aside"
      bg="primary.900"
      height="100%"
      width={"40vw"}
      position="fixed"
      bottom={0}
      zIndex={1000}
      display={["flex", "flex", "none"]}
      pl={3}
      justifyContent="space-between"
      left={state?.isOpen ? "0" : "-40vw"}
      transition="all 250ms ease-in"
    >
      <Flex
        as="ul"
        direction="column"
        listStyleType={"none"}
        gap={5}
        mt={10}
        color="gray.400"
        // ml={3}
        fontSize="sm"
        width="90%"
      >
        <Flex as="li" gap={3} padding={2} onClick={() => state?.setOpen(false)}>
          <RiHome8Fill fontSize={"1.3rem"} />
          <Link href="/admin/chair/dashboard">
            <a>Dashboard</a>
          </Link>
        </Flex>
        <Flex
          as="li"
          gap={3}
          padding={2}
          className="active"
          onClick={() => state?.setOpen(false)}
        >
          <IoIosPersonAdd fontSize={"1.3rem"} />
          <Link href="/admin/chair/applications">
            <a>Applications</a>
          </Link>
        </Flex>
        <Flex as="li" gap={3} padding={2} onClick={() => state?.setOpen(false)}>
          <FaThumbsUp fontSize={"1.3rem"} />
          <Link href="/admin/chair/appr">
            <a>Approved</a>
          </Link>
        </Flex>
        <Flex as="li" gap={3} padding={2} onClick={() => state?.setOpen(false)}>
          <FaThumbsDown fontSize={"1.3rem"} />
          <Link href="/admin/chair/dis">
            <a>Disapproved</a>
          </Link>
        </Flex>
        <Flex as="li" gap={3} padding={2} onClick={() => state?.setOpen(false)}>
          <MdPending fontSize={"1.3rem"} />
          <Link href="/admin/chair/pending">
            <a>Pending</a>
          </Link>
        </Flex>
      </Flex>
      <Flex
        as="div"
        gap={3}
        cursor={"pointer"}
        color="white"
        padding={2}
        onClick={async () => {
          await signOut({callbackUrl:"/admin/login"})

          state?.setOpen(false)
        }}
      >
        <FiLogOut fontSize={"1.3rem"} />
        <Text>Logout</Text>
      </Flex>
      <Box
        id="close"
        position="absolute"
        right="0"
        cursor="pointer"
        onClick={() => state?.setOpen(false)}
      >
        <IoMdClose fontSize={"1.8rem"} color="white" />
      </Box>
    </Flex>
  );
};
export default MobileSidebar;
