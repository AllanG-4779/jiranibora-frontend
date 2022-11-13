import { Flex, Spinner } from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import HomePage from "../Components/client/Landing";
import Layout from "../Components/Layout";
import { sessionType } from "../Components/types";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    //  redirect accordingly
    const handleRedirect = async () => {
      setLoading(true);
      const session = (await getSession()) as sessionType;
      setLoading(false);
      if (session) {
        if (session.user.role === "CHAIR") {
          router.push("/admin/chair/dashboard");
        }
      }
    };
    handleRedirect();
  }, []);
  if (loading) {
    return (
      <Flex
        width="100vw"
        height="100vh"
        justifyContent={"center"}
        alignItems="center"
      >
        <Spinner speed={".8s"} />
      </Flex>
    );
  } else {
    return (
      <>
        <HomePage />
      </>
    );
  }
};

Home.PageLayout = Layout;
export default Home;
