import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Button,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AlertBox from "../client/Signup/Alert";
import { checkAuthStatusAndReturnToken, isTokenExpired } from "../../Commons";
import jwtDecode from "jwt-decode";
import { backendJWT, sessionType } from "../types";

const Login = () => {
  const [authData, setAuthData] = useState({ memberId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(-100);
  const [message, setMessage] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    const securePage = async () => {
      //   Check if logged in member is a Chairperson
      const session = (await getSession()) as sessionType;
      let role: string[] = [];
      if (session && !isTokenExpired(session.user.access_token)) {
        if (session.user.access_token) {
          role = session.user.role.split(";");
        }
        if (role.includes("CHAIR")) {
          await router.push("/admin/chair/dashboard");
        }
        if (role.includes("TRE")) {
          await router.push("/admin/treasurer");
        }
        if (role.includes("SEC")) {
          await router.push("/admin/secretary");
        }
      }
    };
    securePage()
      .then((r) => console.log(r))
      .catch((res) => console.log(res));
  }, [router]);

  return (
    <>
      <Flex
        width="100vw"
        height={"100vh"}
        justify="center"
        alignItems={["flex-start", "center"]}
        bg="#f2f2f2"
      >
        <Flex
          direction={"column"}
          p={5}
          width="21.3rem"
          rounded="md"
          gap={4}
          mt={["5rem", "0"]}
          bg="white"
          boxShadow={"lg"}
        >
          <Heading alignSelf="center" fontSize="3xl" color="primary.900">
            JiraniBora
          </Heading>
          <Heading
            fontSize={"sm"}
            color="primary.900"
            fontWeight={"normal"}
            alignSelf="center"
          >
            {isExisting ? (
              <Text
                color="green.600"
                bg="green.100"
                p={2}
                textAlign="center"
                rounded="md"
              >
                Welcome back {session?.user?.name}. Confirm its really you
              </Text>
            ) : (
              "Sign in to access your account"
            )}
          </Heading>
          <VStack>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                borderColor="gray.300"
                placeholder="JBxxxxxx"
                value={authData.memberId}
                onChange={(e) =>
                  setAuthData({ ...authData, memberId: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="********"
                value={authData.password}
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
              />
            </FormControl>
            <Flex width={"100%"} direction="column" mt={3}>
              <FormControl>
                <Checkbox size={"md"}>
                  <Text fontSize={".8rem"}>Stay logged in for 24hrs</Text>
                </Checkbox>
              </FormControl>
              <FormControl>
                <Link href="#" passHref>
                  <Text fontSize={".8rem"} color="blue.600" as="a">
                    Forgot Password?
                  </Text>
                </Link>
              </FormControl>
            </Flex>

            <FormControl>
              <Button
                width="100%"
                bg="primary.900"
                color="white"
                _hover={{ bg: "primary.700" }}
                my={".5rem"}
                onClick={async () => {
                  setLoading(true);
                  const { password, memberId } = authData;
                  if (password.length == 0 || memberId.length == 0) {
                    setSize(2);
                    setMessage("All fields are required");
                    setLoading(false);
                    return;
                  }

                  const res = await signIn("credentials", {
                    memberId,
                    password,
                    redirect: false,
                    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/login`,
                  });
                  setLoading(false);
                  if (res?.url) await router.push(res.url);
                  if (res?.error) {
                    setSize(2);
                    setMessage("Are you sure those are correct?");
                    setTimeout(() => setSize(-100), 4000);
                  }
                  if (res?.url) await router.push(res.url);
                }}
              >
                {loading ? <Spinner speed={"1s"} /> : "Login"}
              </Button>
            </FormControl>
          </VStack>
        </Flex>
        {/* <OTPModal
          open={modal}
          heading="Let confirm its really You"
          action="
        Enter the OTP sent to +2547xxx665 to confirm account ownership"
          caution="Carrier charge rates apply"
          toggle={setModal}
        /> */}
      </Flex>
      <AlertBox type="error" message={message} size={size} setSize={setSize} />
    </>
  );
};
export default Login;
