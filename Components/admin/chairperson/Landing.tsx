import {Box, Flex, Spinner, VStack} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AppBar } from "./AppBar";
import { SideBar } from "./SideBar";
import { ChairmanContext } from "./Context";
import MobileSidebar from "./MobileSidebar";
import { db_application, sessionType } from "../../types";
import { getSession, signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";
import AlertBox from "../../client/Signup/Alert";
import CountDown from "./CountDown";
import { useRouter } from "next/router";
import {checkAuthStatusAndReturnToken} from "../../../Commons";

type content = {
  children: React.ReactNode;
};

const Landing = ({ children }: content) => {
  const [isOpen, setOpen] = useState(false);

  const [applications, setApplications] =
    useState<Array<db_application> | null>(null);

  // For the sake of securing this page, there is need to maintain the state of the loading
  // when figuring out whether a user is signed in using the getSession method from next auth
  const [loading, setLoading] = useState(true);
  // This effect is for client security

  // Alert data
  const [message, setMessage] = useState("");
  const [size, setSize] = useState(-100);

  const router = useRouter();
  useEffect(() => {
    const securePage = async () => {
      setLoading(true);
     const token = await checkAuthStatusAndReturnToken(router, "CHAIR")
      setTimeout(()=>setLoading(false), 5000)
      };
    securePage().then(r => console.log(r)).catch(er=>console.log(er))
  }, []);

  return (
    <Flex
      width={["100vw", "calc(100vw -12rem)"]}
      height={"full"}
      direction={"column"}
    >
      {loading ? (
          <VStack height={"100vh"} width={"100vw"} justifyContent={"center"}>
        <Spinner></Spinner>
          </VStack>
      ) :

        <ChairmanContext.Provider
          value={{
            isOpen,
            setOpen,
            applications: applications,
            updateApplications: setApplications,
          }}
        >
          <AppBar />
          <MobileSidebar />
          <Flex>
            <SideBar />
            <Flex
              padding={2}
              display="flex"
              flexDir={["column"]}
              mt={["4rem", "4rem", "3rem"]}
              ml={["0", "0", "12rem"]}
              width="100%"
              minHeight={["calc(100vh - 3rem)"]}
              gap={5}
              bg="#f2f2f2"
              overflow={"hidden"}
            >
              {children}
            </Flex>
          </Flex>
          <AlertBox
            message={message}
            type="error"
            size={size}
            setSize={setSize}
          />
        </ChairmanContext.Provider>
      }

    </Flex>
  );
};

export default Landing;
