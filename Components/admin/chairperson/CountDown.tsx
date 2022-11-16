import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";

const CountDown = (props: any) => {
  const router = useRouter();
  const [total, setTotal] = useState(props.seconds);
  const days = Math.floor(total / (60 * 60 * 24));
  const hours = Math.floor((total - days * 60 * 60 * 24) / 3600);
  const minutes = Math.floor(
    (total - (days * 60 * 60 * 24 + hours * 3600)) / 60
  );
  const seconds = Math.floor(
    total - (days * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60)
  );

  useEffect(() => {
    if (total >= 1) {
      const timer = setInterval(() => {
        return setTotal((prev: number) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [total]);
  return (
    <>
      <Box
        mx="auto"
        fontFamily={"Monteserrat"}
        display="flex"
        p={2}
        top={2}
        color="white"
        rounded={"md"}
        flexDirection="column"
        alignItems="center"
        zIndex={200}
        cursor="move"
        justifyContent="center"
        bg={total % 2 === 0 ? "red.500" : "twitter.400"}
        minHeight="4rem"
        shadow="md"
        _hover={{ opacity: 1 }}
      >
        <Text fontWeight="bold">{props.title}</Text>
        {total > 0 ? (
          <>
            <Box
              display={"flex"}
              fontWeight="bolder"
              color="white"
              fontSize="1.2rem"
              gap={4}
            >
              <Text>{days < 10 ? "0" + days : days}</Text>:
              <Text>{hours < 10 ? "0" + hours : hours}</Text>:
              <Text>{minutes < 10 ? "0" + minutes : minutes}</Text>:
              <Text transition="all 400ms ease">
                {seconds < 10 ? "0" + seconds : seconds}
              </Text>
            </Box>{" "}
            <Box
              display={"flex"}
              fontSize=".8rem"
              justifyContent="space-between"
              ml={2}
              color="white"
              width="100%"
            >
              {" "}
              <Text>Days</Text>
              <Text>Hours</Text>
              <Text>Minutes</Text>
              <Text>Seconds</Text>
            </Box>
          </>
        ) : (
          <Text fontSize="normal">{props.endMessage}</Text>
        )}
      </Box>
    </>
  );
};
export default CountDown;
