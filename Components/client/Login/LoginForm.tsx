import {
  background,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { credentialProperties, userData } from "../../types";
import Header from "../../Navigation";
import OTPModal from "../HOC/OtpModal";
import { signIn } from "next-auth/react";
import AlertBox from "../Signup/Alert";
import { useRouter } from "next/router";

function LoginForm() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<userData>({
    memberId: "",
    password: "",
  });
  // To support the alert pop up

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // login functionality

  const login = async (authCredentials: {
    memberId: string;
    password: string;
  }) => {
    // start the loading indicator
    setLoading(true);
    const { memberId, password } = authCredentials;
    const credentialLogin = await signIn("credentials", {
      memberId,
      password,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/client/my`,
      redirect: false,
    });
    setLoading(false);
    if (credentialLogin?.error) setMessage("Invalid details provided.");
    if (credentialLogin?.url) {
      router.push(credentialLogin?.url);
    }
  };
  return (
    <Box
      width={["88vw", "25em"]}
      display="flex"
      flexDirection={"column"}
      padding={5}
      bg="white"
      rounded={"md"}
      shadow="lg"
    >
      <form>
        <Header />
        <Text color="primary.900" align={"center"}>
          Know how your account is performing
        </Text>
        <VStack mt={7}>
          <FormControl color="black.600" isInvalid={message.length > 0}>
            <FormLabel>Member ID</FormLabel>
            <Input
              type={"text"}
              name="userId"
              color="gray.600"
              value={credentials?.memberId}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  memberId: e.target.value,
                } as userData)
              }
              placeholder={"e.g. JBxxxxx"}
            />

            <FormErrorMessage>{message}</FormErrorMessage>
          </FormControl>
          <FormControl color="black.600" isInvalid={message.length > 0}>
            <FormLabel>Password</FormLabel>
            <Input
              type={"password"}
              name="password"
              value={credentials?.password}
              color="gray.600"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <FormErrorMessage>{message}</FormErrorMessage>
          </FormControl>
          <FormControl mt={2} display="flex" alignItems={"center"}>
            <Checkbox value={"true"} colorScheme="green">
              <Box as="span">Remember me</Box>
            </Checkbox>
          </FormControl>
          <FormControl>
            <Button
              bg="primary.900"
              color="white"
              mt={3}
              width="100%"
              onClick={() => login(credentials)}
              _hover={{ background: "primary.700" }}
            >
              {loading ? <Spinner /> : "Login"}
            </Button>
          </FormControl>
          <Text>Or</Text>
          <FormControl color="black.600">
            <Button
              as="a"
              href="register"
              borderColor="primary.900"
              color="primary.900"
              width="100%"
              borderWidth={"0.5px"}
              _hover={{
                background: "primary.900",
                color: "white",
                border: "none",
              }}
            >
              Apply
            </Button>
          </FormControl>
        </VStack>
      </form>
      {/* <AlertBox
        setSize={setSize}
        size={size}

        type={"error"}
        message={message}
      /> */}
    </Box>
  );
}

export default LoginForm;
