import {
  Heading,
  Flex,
  Text,
  Circle,
  CircularProgress,
  CircularProgressLabel,
  Box,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  InputLeftAddon,
  Spinner,
  Alert,
  VStack,
} from "@chakra-ui/react";
import "react-circular-progressbar/dist/styles.css";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { FaDownload, FaMoneyBill } from "react-icons/fa";
import { IoMdAnalytics, IoMdPeople } from "react-icons/io";
import LineChart from "../../Linechart";
import { ArrowRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { secHomePage, sessionType } from "../../types";
import {
  checkAuthStatusAndReturnToken,
  dateDescription,
  fetchData,
  getTimeDetails,
} from "../../../Commons";
import { useRouter } from "next/router";
import axios from "axios";
import { getSession } from "next-auth/react";

//var CanvasJSReact = require('./canvasjs.react');

const SecretaryDashboard = () => {
  const [authToken, setToken] = useState("");
  const [homepageData, setHomeData] = useState<secHomePage | null>(null);
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAuthStatusAndReturnToken(router, "SEC").then((tokenFound) => {
      if (tokenFound) setToken(tokenFound);
    });
    getHomePage(authToken)
      .then((result) => setHomeData(result))
      .catch((error) => console.log(error));
  }, [authToken]);
  const sendReminder = async (phoneNumber: string) => {
    setLoading(true);
    // Validate
    if (phone.length < 9 || phone.length > 9) {
      setMessage("Invalid Phone number");
      setTimeout(() => setMessage(""), 5000);
      return;
    }
    if (!(phone.charAt(0) === "7") && !(phone.charAt(0) === "1")) {
      setMessage("Start with 7 or 1 please.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    const session = (await getSession()) as sessionType;
    const request = await axios.post(
      `https://jiranibora.herokuapp.com/sms/send?phone=${phoneNumber}`,
      {},
      { headers: { Authorization: `Bearer ${session.user.access_token}` } }
    );
    setLoading(false);
    if (request.data) {
      //
      // setLoading(false)
      setMessage("Reminder sent successfully.");
    } else if (request.status !== 200) {
      // handle error
      setMessage("Failed. ensure that the number is verified with Twilio.");
    }
  };
  // Fetch the homepage data on page load
  const getHomePage = async (token: string) => {
    const secretaryData = await fetchData({
      url: "fine/get/info",
      method: "GET",
      token,
    });
    if (typeof secretaryData !== ("number" || "undefined")) {
      return secretaryData;
    } else {
      console.log("The meeting is " + secretaryData);
    }
  };
  // Graph data

  const data = {
    labels:
      typeof homepageData !== "undefined" &&
      homepageData?.meetinglyFine?.map((each) => each.month),

    datasets: [
      {
        label: "2022",
        data: homepageData?.meetinglyFine?.map((each) => each.total),
        backgroundColor: "orange",
        borderColor: "dodgerblue",
      },
    ],
  };
  return (
    <>
      {homepageData === null || authToken.length <= 0 ? (
        <VStack h={"100vh"} w={"100vw"} justifyContent={"center"}>
          <Spinner />
        </VStack>
      ) : (
        <Flex direction="column" width="100%" h="full" p={3}>
          <Heading fontFamily={"body"} fontSize="xl" fontWeight="light">
            Dashboard
          </Heading>

          <Flex
            mt={2}
            width="95%"
            mx="auto"
            p={4}
            gap={5}
            direction={["column", "column", "column", "row"]}
          >
            {/* Meetings held */}
            <Flex
              direction="column"
              p={3}
              bg="white"
              rounded="md"
              gap={13}
              width={["100%", "100%", "33%"]}
            >
              <Text color="gray">Meetings This year</Text>
              <Box width="150px" height="150px" alignSelf={"center"}>
                <CircularProgressbarWithChildren
                  value={
                    typeof homepageData !== "undefined"
                      ? homepageData!.totalMeetings
                      : 1
                  }
                  maxValue={12}
                  strokeWidth={3}
                  minValue={0}
                  counterClockwise
                >
                  <Box color="gray">
                    <span style={{ color: "black", fontWeight: "bolder" }}>
                      {homepageData?.totalMeetings}
                    </span>
                    /12
                  </Box>
                  <Box fontSize=".8rem">Completed</Box>
                </CircularProgressbarWithChildren>
              </Box>
              {/* <Box fontSize=".8rem" display={"flex"} gap={3} alignItems="center">
              <Text>Next meeting</Text>
              <Text color="gray" textAlign={"center"} fontWeight="bolder">
                3rd June
              </Text>
            </Box> */}
              <Button
                colorScheme="blue"
                as="a"
                size="xs"
                color="white"
                href="/admin/secretary/meetings"
              >
                Go to meetings
                <ArrowRight color="inherit" />
              </Button>
            </Flex>
            {/* Cash fines */}
            <Flex direction="column" gap={5} width={["100%", "100%", "38%"]}>
              <Flex
                bg={"white"}
                p={5}
                gap={4}
                rounded={4}
                flex={1}
                direction="column"
              >
                <Flex alignItems={"center"} gap={5}>
                  <Box bg="red.400" p={2} rounded="full">
                    <FaMoneyBill color="white" fontSize="2rem" />
                  </Box>
                  <Flex direction="column">
                    <Text fontSize="lg" color="">
                      KSH {homepageData?.totalPendingFines}
                    </Text>
                    <Text color="gray" fontSize=".9rem">
                      Total Fines Pending
                    </Text>
                  </Flex>
                </Flex>
                <Flex alignItems={"center"} gap={5}>
                  <Box bg="green.400" p={2} rounded="full">
                    <IoMdAnalytics color="white" fontSize="2rem" />
                  </Box>
                  <Flex direction="column">
                    <Text fontSize="lg" color="">
                      KSH {homepageData?.totalFinesCollected}
                    </Text>
                    <Text color="gray" fontSize=".9rem">
                      Collected fines
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                bg={"white"}
                flex={1}
                p={5}
                rounded="md"
                alignItems={"center"}
                gap={3}
              >
                <Box bg="blue.500" p={2} rounded="full">
                  <IoMdPeople fontSize={"2rem"} color="white" />
                </Box>
                <Flex direction={"column"}>
                  <Text fontWeight={"bold"} fontSize="1.5rem">
                    {homepageData.latestFines.length}
                  </Text>
                  <Text color="gray" fontSize=".9rem">
                    Members with unpaid fines
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              width={["100%", "100%", "100%", "33%"]}
              p={4}
              bg="white"
              rounded="md"
              direction="column"
              gap={4}
            >
              <Text fontSize="lg" fontWeight={"semibold"}>
                Quick Actions
              </Text>

              <Box
                gap={2}
                display="flex"
                flexDirection={"column"}
                h={"100%"}
                p={4}
              >
                <Text>Fine Reminder</Text>
                <InputGroup>
                  <InputLeftAddon>+254</InputLeftAddon>
                  <Input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </InputGroup>
                <Alert
                  display={message.length > 0 ? "flex" : "none"}
                  colorScheme={message.startsWith("Reminder") ? "green" : "red"}
                >
                  {message}
                </Alert>
                <Button
                  onClick={() => sendReminder(phone)}
                  size="sm"
                  colorScheme="blue"
                  mt={4}
                >
                  Send fine Reminder
                </Button>
              </Box>
            </Flex>
          </Flex>
          <Flex
            width="95%"
            mx="auto"
            p={4}
            gap={7}
            h="100%"
            direction={["column", "column", "column", "row"]}
          >
            {/* Recent fines */}
            <Flex bg="white" p={4} direction="column" h={"100%"} flex={1}>
              <Text fontWeight={"semibold"}>Latest Fines</Text>
              {homepageData.latestFines.length >= 1 ? (
                homepageData.latestFines.map((each) => {
                  return (
                    <Flex
                      key={each.memberId + each.fine + each.meetingId}
                      mt={3}
                      width="100%"
                      justifyContent={"space-between "}
                      alignItems="center"
                      fontSize=".9rem"
                    >
                      <Flex gap={4}>
                        <Box
                          bg="yellow.500"
                          padding={3}
                          rounded="50%"
                          display="flex"
                          color="white"
                          width="50px"
                          height={"50px"}
                          justifyContent="center"
                          alignItems={"center"}
                        >
                          <Text>
                            {each.name.split(" ")[0][0] +
                              each.name.split(" ")[1][0]}
                          </Text>
                        </Box>
                        <Flex direction="column">
                          <Text fontWeight={"bold"}>{each.fine}</Text>
                          <Text color="gray" fontSize="sm">
                            {each.name}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex direction="column">
                        <Text fontWeight={"bold"}>KES {each.amount}</Text>
                        <Text color="gray" fontSize="sm">
                          {dateDescription(getTimeDetails(each.dateFined).date)}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })
              ) : (
                <Alert
                  color="green.600"
                  rounded="md"
                  colorScheme="green"
                  justifySelf="center"
                  mt={10}
                >
                  All fines have been paid
                </Alert>
              )}
            </Flex>
            {/* GRAPH */}
            <Flex
              bg="white"
              p={4}
              direction="column"
              h={"100%"}
              flex={1}
              minHeight={"20rem"}
            >
              <Text fontWeight={"bold"}>Fine collection trend</Text>
              <Flex flex={2} position="relative" overflow="auto">
                <LineChart data={data} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};
export default SecretaryDashboard;
