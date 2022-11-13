import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import homepage from "../../public/homepage.jpg";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import axios from "axios";
import AlertBox from "./Signup/Alert";
import { NextPage } from "next";

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [size, setSize] = useState(-100);

  const sendEmail = async (address: string) => {
    setLoading(true);
    const reg = new RegExp("^[a-zA-Z0-9]+@[a-z0-9]+.[a-z.]+$");
    if (!reg.test(address)) {
      setValid(true);
      setLoading(false);
      setSize(2);
      setTimeout(() => setSize(-100), 5000);
      return;
    }
    try {
      const req = await axios.post(
        "/api/email",
        { recipient: email, message: "Thank you for reaching us" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (req.status == 200) {
        setLoading(false);

        setValid(false);
        setSuccess(
          "Check your inbox, if you can't find it, be sure to check your spam folder"
        );
        setSize(2);
        setTimeout(() => setSize(-100), 5000);
      }
    } catch (e) {
      setLoading(false);
      setValid(true);
      setSize(2);
    }
  };

  return (
    <>
      <Flex
        shadow={"sm"}
        p={1}
        justifyContent="space-between"
        as="nav"
        alignItems={"center"}
      >
        <Text
          _hover={{ border: "1px dashed indigo" }}
          fontSize={"1.4rem"}
          fontFamily="logo"
          color={"primary.900"}
          fontWeight="bolder"
          ml={3}
          border={"1px dashed transparent"}
          p={1}
          transition="all 200ms ease"
        >
          JiraniBora
        </Text>
        <Flex
          gap={[3, 6]}
          mr={[3, 10]}
          alignItems="center"
          listStyleType={"none"}
        >
          <Box p={1} rounded={"md"} cursor="pointer">
            <Box
              color="primary.900"
              fontWeight={"bold"}
              fontFamily="Arial"
              transition={"all 500ms ease"}
              border="1px dashed transparent"
              p={1}
              _hover={{ border: "1px dashed indigo" }}
            >
              <Link passHref href={"/login"}>
                <a>Login</a>
              </Link>
            </Box>
          </Box>
          <Box
            bg="primary.900"
            p={2}
            shadow="sm"
            rounded={"23px"}
            minWidth="8rem"
            textAlign={"center"}
          >
            <Box color="white" fontFamily={"Poppins"} fontWeight="bold">
              <Link passHref href={"/register"}>
                <a>Join Now</a>
              </Link>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <Flex
        maxWidth={"90%"}
        mx="auto"
        direction={["column", "column", "row"]}
        alignItems={["flex-start", "flex-start", "flex-start"]}
        height="90vh"
        mt={["3rem", "8rem"]}
      >
        <Flex width="100%" direction="column" gap={2} fontSize="md">
          <Heading fontSize="3rem" fontFamily={"body"} color="primary.900">
            Save, Borrow, Earn interest.
          </Heading>
          <Text fontWeight={"light"} color="gray" fontFamily={"body"}>
            Curb the January hurdles by joining JiraniBora today. With as little
            as KES500 of your monthly income, you qualify for loans of upto 2x
            your savings
            <br />
            <span style={{ marginTop: "3px" }}>
              To get started, Simply click the{" "}
              <span
                style={{
                  border: ".8px solid blue",
                  padding: "2px",
                  borderRadius: "5px",
                  fontWeight: "semibold",
                  fontSize: "12px",
                }}
              >
                Join Now
              </span>{" "}
              and follow instructions
            </span>
          </Text>

          <Text fontSize={"1.3rem"} mt={["1rem", "4rem"]} color="primary.900">
            Not sure, Get an email from us with full description of JiraniBora.
          </Text>
          <Flex
            alignItems={["flex-start", "flex-start", "center"]}
            gap={4}
            mt={4}
            direction={["column", "column", "row"]}
          >
            <Input
              placeholder="someone@dormans"
              type="email"
              padding="10px"
              color="GrayText"
              outline="none"
              border="1px solid #d3d3d3"
              transition={"none"}
              rounded="0"
              minHeight={"3rem"}
              autoFocus={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              borderRadius={"0"}
              colorScheme="green"
              height={"2.9rem"}
              minWidth={["full", "full", "fit-content"]}
              onClick={() => sendEmail(email)}
            >
              {!loading ? "Get Detailed information" : <Spinner />}
            </Button>
          </Flex>
        </Flex>
        <Box display={["none", "none", "flex"]}>
          <Image
            src={homepage}
            width={1200}
            height={500}
            alt="homepage image"
            objectFit="cover"
            loading="eager"
            onLoadStart={() => setLoading(true)}
            onLoadingComplete={() => setLoading(false)}
          />
        </Box>

        <AlertBox
          message={
            valid
              ? "Network error or the address you provided is invalid"
              : success
          }
          type={valid ? "error" : "success"}
          setSize={setSize}
          size={size}
        />
      </Flex>
    </>
  );
};

export default HomePage;
