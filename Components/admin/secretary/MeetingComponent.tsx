import {
  Flex,
  Button,
  Alert,
  Text,
  Heading,
  TableContainer,
  Table,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  Spinner,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { Download, Error } from "@mui/icons-material";
import { getTime } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import {
  checkAuthStatusAndReturnToken,
  clientPost,
  dateDescription,
  fetchData,
  fetchToken,
  getTimeDetails,
  isTokenExpired,
} from "../../../Commons";
import AlertBox from "../../client/Signup/Alert";
import { meeting } from "../../types";

const MeetingComponent = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [size, setSize] = useState(-100);
  const [meetingOn, checkMeetingOn] = useState(false);
  const [meetings, setMeetings] = useState<meeting[]>([]);
  const [authToken, setToken] = useState("");
  const router = useRouter();
  const [fetchStatus, setStatus] = useState({
    loading: false,
    message: "",
    type: "",
  });

  const [currentMeeting, setCurrentMeeting] = useState("JAN");
  const startMeeting = async (month: string, token: string) => {
    setStatus({ loading: true, message: "", type: "" });
    const meetingRes = await clientPost({
      url: `meeting/start`,
      method: "POST",
      token,
    });
    setStatus({ ...fetchStatus, loading: false });
    if (meetingRes <= 299) {
      setStatus({
        ...fetchStatus,
        message: "Meeting was started successfully",
        type: "success",
      });
    } else if (meetingRes === 409) {
      setStatus({
        ...fetchStatus,
        type: "error",
        message: "Close previous meeting first",
      });
    } else {
      setStatus({
        ...fetchStatus,
        type: "error",
        message: "Unknown error occured",
      });
    }
  };

  const closeMeeting = async (meetingId: any, token: string) => {
    setStatus({ ...fetchStatus, loading: true });
    const meetingClose = await clientPost({
      method: "PUT",
      url: `meeting/stop?meeting_id=${meetingId}`,
      token,
    });
    setStatus({ ...fetchStatus, loading: false });
    if (meetingClose <= 299) {
      console.log("Success");
      console.log(meetingClose);
    }
  };

  useEffect(() => {
    checkAuthStatusAndReturnToken(router, "SEC")
      .then((success) => {
        if (success) setToken(success);
      })
      .catch((e) => console.log(e));

    const fetchMeetings = async (token: string) => {
      const meetingdata = (await fetchData({
        url: "meeting/all",
        method: "GET",
        token,
      })) as meeting[];
      console.log(meetingdata);
      return meetingdata;
      // }
    };

    fetchMeetings(authToken)
      .then((each) => {
        console.log("The meeting " + authToken.length);
        setMeetings(each);
        const activeMeetings = each.filter(
          (meeting) => meeting.status === "ON"
        );
        checkMeetingOn(activeMeetings.length > 0);
      })
      .catch((e) => console.log(e));
  }, [authToken]);
  let activeMeeting = meetings?.filter((meet) => meet.status == "ON")[0];
  return (
    <>
      {authToken.length === 0 && meetings === null ? (
        <VStack h={"100vh"} w={"100vw"} justifyContent={"center"}>
          <Spinner />
        </VStack>
      ) : (
        <Flex
          bg="column"
          direction="column"
          mt={7}
          width={["100%", "100%", "80%"]}
          mx="auto"
        >
          <Heading fontFamily={"body"} fontWeight="normal" fontSize="xl">
            Meetings
          </Heading>
          <Flex bg="white" p={10} mt={4} direction="column" rounded="md">
            {!meetingOn ? (
              <Button
                colorScheme="twitter"
                fontWeight={"normal"}
                size="sm"
                display={"inline-block"}
                width="10rem"
                onClick={onOpen}
              >
                Start a new meeting
              </Button>
            ) : (
              <Button
                colorScheme="red"
                fontWeight={"normal"}
                size="sm"
                display={"inline-block"}
                width="10rem"
                onClick={onOpen}
              >
                Close Meeting
              </Button>
            )}
            <AlertBox
              type={fetchStatus.type}
              message={fetchStatus.message}
              size={size}
              setSize={setSize}
            />
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                {!meetingOn ? (
                  <ModalHeader bg="twitter.600" p={2} color="white">
                    Start a new Meeting
                  </ModalHeader>
                ) : (
                  <ModalHeader
                    p={2}
                    fontSize={"1rem"}
                    bg="red.500"
                    color="white"
                  >
                    Meeting termination
                  </ModalHeader>
                )}
                <ModalCloseButton color={"white"} />
                <ModalBody>
                  {!meetingOn ? (
                    <FormControl>
                   

                      <FormHelperText
                        transition={"display 300ms ease"}
                        gap={2}
                        display={
                          fetchStatus.message.length > 1 ? "flex" : "none"
                        }
                        color={
                          fetchStatus.type == "error" ? "red.500" : "green.500"
                        }
                        p={2}
                        alignItems="center"
                      >
                        {fetchStatus.type === "error" ? (
                          <Text fontWeight="bolder">Failed</Text>
                        ) : (
                          ""
                        )}{" "}
                        {fetchStatus.message}
                      </FormHelperText>
                    </FormControl>
                  ) : (
                    <Box>
                      <Text>
                        The meeting{" "}
                        <span style={{ fontWeight: "bolder" }}>
                          {activeMeeting?.meetingId}
                        </span>{" "}
                        for Month{" "}
                        <span style={{ fontWeight: "bolder" }}>
                          {activeMeeting?.month}
                        </span>{" "}
                        held on{" "}
                        <span style={{ fontWeight: "bolder" }}>
                          {getTimeDetails(activeMeeting?.meetingDate).date}
                        </span>{" "}
                        will be closed
                      </Text>
                    </Box>
                  )}
                </ModalBody>

                <ModalFooter gap={10}>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant={"ghost"}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  {!meetingOn ? (
                    <Button
                      colorScheme="blue"
                      mr={3}
                      size="sm"
                      onClick={async () =>
                        await startMeeting(currentMeeting, authToken)
                      }
                    >
                      Start Meeting
                    </Button>
                  ) : (
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={async () => {
                        await closeMeeting(activeMeeting?.meetingId, authToken);
                        await setTimeout((e) => {
                          onClose();
                          router.reload();
                        }, 1000);
                      }}
                    >
                      {fetchStatus.loading ? <Spinner /> : "Proceed"}
                    </Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Flex direction={"column"} mt={4}>
              <Text>Previous Meetings</Text>
              {meetings !== null && meetings.length > 0 ? (
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Meeting ID</Th>
                        <Th>Meeting Month</Th>
                        <Th>When</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {meetings.map((meeting) => {
                        return (
                          <Tr key={meeting.meetingId}>
                            <Td>{meeting.meetingId}</Td>
                            <Td>{meeting.month}</Td>
                            <Td>
                              {dateDescription(
                                getTimeDetails(meeting.meetingDate).date
                              )}
                            </Td>

                            <Td
                            // color={
                            //   meeting.status.startsWith("E")
                            //     ? "red.600"
                            //     : "green.600"
                            // }
                            >
                              <Badge
                                colorScheme={
                                  meeting.status.startsWith("E")
                                    ? "red"
                                    : "green"
                                }
                              >
                                {meeting.status}
                              </Badge>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert colorScheme="blue">Seems like this is a new year.</Alert>
              )}
            </Flex>{" "}
            <Box
              mt={5}
              width="90%"
              mx={"auto"}
              display="flex"
              justifyContent={"flex-end"}
            >
              <Button
                justifySelf={"flex-end"}
                colorScheme="twitter"
                size="xs"
                gap={2}
              >
                <FaFilePdf /> Meeting Report
              </Button>
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  );
};
export default MeetingComponent;
