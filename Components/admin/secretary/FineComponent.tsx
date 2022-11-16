import {
  Flex,
  Heading,
  Text,
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  Spinner,
  FormHelperText,
  Alert,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  checkAuthStatusAndReturnToken,
  clientPost,
  dateDescription,
  fetchData,
  getTimeDetails,
} from "../../../Commons";
import AlertBox from "../../client/Signup/Alert";
import { memberToFineType, pendingFineType, sessionType } from "../../types";
import FineCategoryAdditionModal from "./FineCategoryAdditionModal";
import FinePaymentModal from "./FinePaymentModal";

const FineComponent = () => {
  const [search, setSearch] = useState("National ID");
  const [fine, setFine] = useState("");
  const [parameter, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingFines, setPendingFines] = useState<pendingFineType[]>([]);
  const [memberTofine, setmemberTofine] = useState<memberToFineType | null>(
    null
  );
  const [authToken, setToken] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fineToResolve, setFineToResolve] = useState({
    meetingId: "",
    category: "",
    memberId: "",
  });
  const [fineModal, setFineModal] = useState(false);
  const [fineMessage, setFineMessage] = useState("");
  const [fineLoading, setFineLoading] = useState(false);
  const [size, setSize] = useState(-100);

  const router = useRouter();

  // find member
  const fetchUserToFine = async (parameter: string, token: string) => {
    setLoading(true);
    setmemberTofine(null);
    const fineSearch = await fetchData({
      url: `member/to/fine?search=${parameter}`,
      method: "GET",
      token: token,
    });
    setLoading(false);
    if (fineSearch == null) {
      setMessage(
        "No details matched, Confirm that the details are correct and that there is an open meeting "
      );
    } else {
      setMessage("Correct! details matched");

      setmemberTofine(fineSearch);
    }
  };

  // Send SMS reminder
  const sendReminder = async (phoneNumber: string) => {
    setFineLoading(true);
    // Validate

    const session = (await getSession()) as sessionType;
    
    const request = await axios.post(
      `https://jiranibora.herokuapp.com/sms/send?phone=${phoneNumber}`,
      {},
      { headers: { Authorization: `Bearer ${session.user.access_token}` } }
    );
    setFineLoading(false);
    setSize(0.1);
    if (request.data) {
      //
      // setLoading(false)
      setFineMessage("Reminder sent successfully.");
    } else {
      // handle error
      setFineMessage("Failed. ensure that the number is verified with Twilio.");
    }
  };

  // Add fine to member account
  const enforceFine = async (token: string) => {
    setSearchParam("");
    const fineUserResponse = await clientPost({
      method: "POST",
      url: `fine/apply/${memberTofine?.meetingId}/${memberTofine?.memberId}/${fine}`,
      token,
    });
    if (fineUserResponse <= 299) {
      setmemberTofine(null);
      setSearchParam("");
      setMessage("");
    }
    if (fineUserResponse === 403) {
      setSearchParam("");
      setMessage(
        "Applying this fine will lead to conflicting fining i.e. late and absent at the same time"
      );
    }
    if (fineUserResponse === 409) {
      setSearchParam("");
      setMessage(`${fine} fine has already been applied to account holder`);
    }
  };
  // fetch pending fines
  const getPendingFines = async (token: string) => {
    const pendingFineRes = await fetchData({
      method: "GET",
      url: "fine/get/pending",
      token,
    });
    if (typeof pendingFineRes == "object") {
      return pendingFineRes;
    }
  };
  useEffect(() => {
    checkAuthStatusAndReturnToken(router, "SEC").then((myToken) => {
      if (myToken) setToken(myToken);
    });

    getPendingFines(authToken)
      .then((success) => setPendingFines(success))
      .catch((e) => console.log(e));
  }, [authToken]);
  const resolveFine = async (
    { category, memberId, meetingId } = fineToResolve,
    token: string
  ) => {
    const sendData = await clientPost({
      method: "PUT",
      url: `pay/fine/${category}/${meetingId}?memberId=${memberId}`,
      token,
    });
    if (sendData <= 299) {
      console.log("Success");
      router.reload();
    } else {
      console.log("failure");
    }
  };

  return (
    <>
      <Flex
        mt={3}
        width={["97%", "90%", "85%", "80%"]}
        mx="auto"
        direction="column"
        gap={4}
      >
        <Heading fontSize="2xl" fontFamily="body" fontWeight="light">
          Fine Management
        </Heading>
        <Flex
          bg="white"
          p={5}
          mt={5}
          direction="column"
          rounded="md"
          shadow={"sm"}
        >
          <Flex fontWeight="bold" mb={3} justifyContent="space-between">
            <Text>Add fine</Text>
            <Button
              colorScheme="twitter"
              size="sm"
              onClick={() => {
                setFineModal(false);
                onOpen();
              }}
            >
              Add fine category
            </Button>
          </Flex>
          <Flex gap={10} direction={["column", "column", "row"]}>
            <Box p={5} rounded="md" flex={1}>
              <FormControl>
                <FormLabel>Find Member by</FormLabel>
                <Select
                  onChange={(e) => setSearch(e.target.value)}
                  defaultValue="National ID"
                >
                  <option value="National ID">National ID</option>
                  <option value="Member ID">Member ID</option>
                  <option value="Email address">Email address</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Enter {search}</FormLabel>
                <Input
                  value={parameter}
                  onChange={(e) => setSearchParam(e.target.value)}
                />
                <FormHelperText
                  display={
                    message.length > 1 && memberTofine == null ? "flex" : "none"
                  }
                  color={message.startsWith("C") ? "green.600" : "red.600"}
                  fontSize={"xs"}
                >
                  {message}
                </FormHelperText>
              </FormControl>
              <FormControl mt={4}>
                <Button
                  colorScheme="twitter"
                  size="sm"
                  fontWeight="light"
                  onClick={() => fetchUserToFine(parameter, authToken)}
                >
                  {loading ? <Spinner /> : "Find Member"}
                </Button>
              </FormControl>
            </Box>
            <Box
              borderLeft={".5px solid #d3d3d3"}
              display={["none", "none", "none", "flex"]}
            ></Box>
            {memberTofine ? (
              <Box p={5} rounded="md" flex={1}>
                <Text fontWeight={"bold"} mb={3}>
                  Member information
                </Text>
                <Flex direction={"column"} gap={3}>
                  <Flex width="100%" gap={10}>
                    <Text fontWeight="semibold">Name</Text>
                    <Text ml={10}>{memberTofine.memberName}</Text>
                  </Flex>
                  <Flex width="100%" gap={9}>
                    <Text fontWeight="semibold">Existing fine</Text>
                    <Text>KES {memberTofine.existingFine}</Text>
                  </Flex>
                  <FormControl>
                    <FormLabel>Fine Category</FormLabel>
                    <Select
                      value={fine}
                      onChange={(e) => setFine(e.target.value)}
                    >
                      <option value={"language"}>Language-50</option>
                      <option value={"absenteeism"}>Absenteeism-50</option>
                      <option value={"lateness"}>Lateness-30</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Button
                      colorScheme="red"
                      size="sm"
                      fontWeight="lighter"
                      onClick={() => enforceFine(authToken)}
                    >
                      {memberTofine !== null && loading ? (
                        <Spinner />
                      ) : (
                        "Enforce fine"
                      )}
                    </Button>
                    <FormHelperText
                      color={message.startsWith("G") ? "green" : "red.500"}
                      fontSize="xs"
                      display={
                        parameter === "" && message.length > 1 ? "flex" : "none"
                      }
                    >
                      {message}
                    </FormHelperText>
                  </FormControl>
                </Flex>
              </Box>
            ) : (
              <Text flex={1} color="gray" fontSize={"normal"}>
                Waiting for a member to be fined
              </Text>
            )}
          </Flex>
        </Flex>
        {/* Fine section */}
        <Flex direction="column" bg="white" rounded="md" p={5} gap={4}>
          <Text fontWeight={"semibold"} fontFamily="body  ">
            Unsettled Fines
          </Text>
          {/* Fine List */}
          <Flex direction="column" gap={4}>
            {pendingFines !== null && pendingFines.length > 0 ? (
              pendingFines.map((each) => {
                return (
                  <Flex
                    key={each.memberId + each.fine}
                    direction={["column", "column", "row"]}
                    gap={5}
                    justifyContent={[
                      "flex-start",
                      "flex-start",
                      "space-between",
                    ]}
                  >
                    <Flex gap={3} flex={1} justifyContent={"space-between"}>
                      <Box
                        bg="green.500"
                        width="50px"
                        height="50px"
                        color="white"
                        rounded="full"
                        display="flex"
                        justifyContent={"center"}
                        alignItems="center"
                      >
                        <Text>
                          {each.name[0] + each.name[1].toLocaleUpperCase()}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight={"bold"}>{each.name}</Text>
                        <Text color="gray" fontSize="sm">
                          {each.fine}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">KES {each.amount}</Text>
                        <Text color="gray" fontSize="sm">
                          {dateDescription(getTimeDetails(each.dateFined).date)}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex
                      gap={5}
                      justifyContent="center"
                      display={["none", "none", "flex"]}
                      flex={1}
                    >
                      <Box marginRight={[0, 0, 0, 10]} display={"flex"} gap={7}>
                        <Button
                          colorScheme="green"
                          fontWeight={"lighter"}
                          size="xs"
                          onClick={() => {
                            setFineModal(true);
                            setFineToResolve({
                              memberId: each.memberId,
                              category: each.fine,
                              meetingId: each.meetingId,
                            });
                            onOpen();
                          }}
                        >
                          Resolve
                        </Button>
                        <Button
                          colorScheme="orange"
                          fontWeight={"lighter"}
                          size="xs"
                          onClick={() => sendReminder(each.phone)}
                        >
                          {fineLoading ? <Spinner /> : "Remind"}
                        </Button>
                        <AlertBox
                          message={fineMessage}
                          type={
                            fineMessage.startsWith("Remind")
                              ? "success"
                              : "error"
                          }
                          size={size}
                          setSize={setSize}
                        />
                      </Box>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <Alert>No Outstanding fines</Alert>
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                {fineModal ? (
                  <FinePaymentModal
                    resolveFine={resolveFine}
                    onClose={onClose}
                    fineToResolve={fineToResolve}
                    authToken={authToken}
                  />
                ) : (
                  <FineCategoryAdditionModal
                    onClose={onClose}
                    authToken={authToken}
                  />
                )}
              </ModalContent>
            </Modal>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default FineComponent;
