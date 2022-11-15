import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { BiFile, BiSave } from "react-icons/bi";
import { FaAd, FaAirFreshener, FaIndent } from "react-icons/fa";
import { MdOutlineBusiness } from "react-icons/md";
import { useContext, useState } from "react";
import {
  ClientContext,
  clientPost,
  formatNumber,
  TokenContext,
} from "../../../Commons";
import AlertBox from "../Signup/Alert";
import { useRouter } from "next/router";

const ClientDashboard = () => {
  const clientData = useContext(ClientContext);
  const sessionToken = useContext(TokenContext);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [size, setSize] = useState(-100);
  const [type, setType] = useState("");
  const router = useRouter();

  const payFine = async (category: string, meetingId: string) => {
    setPaymentLoader(true);
    const result = await clientPost({
      token: sessionToken.token,
      url: `/pay/fine/${category}/${meetingId}`,
      method: "PUT",
    });
    setPaymentLoader(false);
    if (result > 299) {
      setType("error");
      setMessage("Payment failed");
      setSize(0.1);
    } else {
      setType("success");
      setMessage("Payment processing successful");
      setSize(0.1);
    }
    setTimeout(() => {
      router.reload();
    }, 1000);
  };

  // make penalty payment
  const payPenalty = async (penaltyId: string) => {
    setPaymentLoader(true);
    const paymentResult = await clientPost({
      token: sessionToken.token,
      url: `pay/penalty?penaltyId=${penaltyId}`,
      method: "PUT",
    });
    setPaymentLoader(false);
    if (paymentResult > 299) {
      setType("error");
      setMessage("Payment failed");
      setSize(0.1);
    } else {
      setType("success");
      setMessage("Payment processing successful");
      setSize(0.1);
    }
    setTimeout(() => {
      router.reload();
    }, 1000);
  };

  return (
    <>
      <Heading fontWeight={"normal"} letterSpacing="tight" fontSize={"xl"}>
        Welcome back,{" "}
        <Flex fontWeight={"bold"} display="inline-flex">
          {clientData == null ? (
            <Spinner ml={5} size="md" alignSelf={"center"} speed="1.3s" />
          ) : (
            clientData?.accountHolder
          )}
        </Flex>
      </Heading>
      <Flex
        direction="column"
        bg="white"
        p={4}
        width={"100%"}
        rounded="md"
        shadow="sm"
        mt={4}
      >
        <Text fontSize=".9em">At a glance</Text>
        <Flex
          mt={5}
          gap={3}
          direction={["column", "column", "column", "row"]}
          mx="auto"
          width={"100%"}
        >
          <Flex
            direction="column"
            border=".5px solid #d2f2f2"
            p={4}
            rounded="md"
            minHeight={"7rem"}
            minWidth={"14rem"}
            fontFamily="body"
            flexWrap="wrap"
          >
            <Text fontWeight="bold" color="green.500" fontSize=".8em">
              Savings
            </Text>
            <Flex
              alignItems={"center"}
              justifyContent={[
                "flex-start",
                "flex-start",
                "flex-start",
                "space-evenly",
              ]}
              gap={[10, 10, 10, 0]}
              p={[2, 2, 0]}
              mt={4}
            >
              {/* Icon */}
              <Box bg="green.100" p={2} rounded="full">
                <BiSave color="green" />
              </Box>
              <Flex fontFamily={"body"} opacity={0.8} fontSize="xl">
                {clientData == null ? (
                  <Spinner speed="1.2s" />
                ) : (
                  <Text>
                    KSH{" "}
                    {formatNumber(
                      clientData.accountSummary.contributions.toFixed(2)
                    )}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            border=".5px solid #d2f2f2"
            p={4}
            rounded="md"
            minHeight={"7rem"}
            minWidth={"14rem"}
            fontFamily="body"
            flexWrap="wrap"
          >
            <Text fontWeight="bold" color="red.400" fontSize=".8em">
              Loans & interests
            </Text>
            <Flex
              alignItems={"center"}
              justifyContent={[
                "flex-start",
                "flex-start",
                "flex-start",
                "space-evenly",
              ]}
              gap={[10, 10, 10, 0]}
              p={[2, 2, 0]}
              mt={4}
            >
              {/* Icon */}
              <Box bg="red.100" p={2} rounded="full">
                <FaIndent color="red" />
              </Box>
              <Flex fontFamily={"body"} opacity={0.8} fontSize="xl">
                {clientData == null ? (
                  <Spinner speed="1.2s" />
                ) : (
                  <Text>
                    KSH{" "}
                    {formatNumber(
                      clientData.accountSummary.loanAndInterest.toFixed(2)
                    )}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            border=".5px solid #d2f2f2"
            p={4}
            rounded="md"
            minHeight={"7rem"}
            minWidth={"14rem"}
            fontFamily="body"
            flexWrap="wrap"
          >
            <Text color="blue.400" fontSize=".8em">
              Fines & Penalties
            </Text>
            <Flex
              alignItems={"center"}
              justifyContent={[
                "flex-start",
                "flex-start",
                "flex-start",
                "space-evenly",
              ]}
              gap={[10, 10, 10, 0]}
              p={[2, 2, 0]}
              mt={4}
            >
              {/* Icon */}
              <Box bg="blue.100" p={2} rounded="full">
                <MdOutlineBusiness color="blue" />
              </Box>
              <Flex fontFamily={"body"} opacity={0.8} fontSize="xl">
                {clientData == null ? (
                  <Spinner speed="1.2s" />
                ) : (
                  <Text>
                    KSH{" "}
                    {formatNumber(
                      clientData.accountSummary.fineAndPenalties.toFixed(2)
                    )}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {/* Fines & penalties */}
      <Flex bg="white" direction="column" gap={4} p={4} rounded="md">
        <Heading fontSize="2xl">Penalties</Heading>
        <Flex direction={"column"} width="100%">
          <Flex overflow={"auto"}>
            {clientData === null || clientData.penalties.length <= 0 ? (
              <Alert
                colorScheme="green"
                size="sm"
                rounded="md"
                color="green.700"
              >
                <Text fontWeight={"light"}>You have no pending penalties</Text>
              </Alert>
            ) : (
              <TableContainer width="100%" overflow="auto">
                <Table size={"sm"} overflow="auto">
                  <Thead>
                    <Tr>
                      <Th>Month</Th>
                      <Th>Date Issued</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  {!paymentLoader ? (
                    <Tbody>
                      {clientData?.penalties.map((each) => {
                        return (
                          <Tr key={each.penaltyCode}>
                            <Td>{each.meetMonth}</Td>
                            <Td>{each.dateAdded.split("T")[0]}</Td>
                            <Td>KES {each.amount}</Td>
                            <Td>
                              <Badge colorScheme="red">{"Pending"}</Badge>
                            </Td>
                            <Td>
                              <Button
                                size="xs"
                                colorScheme="green"
                                onClick={() => payPenalty(each.penaltyCode)}
                              >
                                {paymentLoader ? <Spinner /> : "Pay Now"}
                              </Button>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  ) : (
                    <VStack alignItems={"center"}>
                      <Spinner />
                    </VStack>
                  )}
                </Table>
              </TableContainer>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex
        bg="white"
        direction="column"
        gap={4}
        p={4}
        rounded="md"
        mb={"200px"}
      >
        <Heading fontSize="2xl">Fines</Heading>
        <Flex direction="column">
          <Flex overflow="auto">
            {clientData === null || clientData.fines.length <= 0 ? (
              <Alert color="green.700" colorScheme="green">
                You have no outstanding fines
              </Alert>
            ) : (
              <TableContainer width="100%">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Date Issued</Th>
                      <Th>Fine Type</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {clientData.fines.map((each) => {
                      return (
                        <Tr key={each.fineCode}>
                          <Td>{each.dateAdded.split("T")[0]}</Td>
                          <Td>{each.category}</Td>
                          <Td>{each.amount}</Td>
                          <Td>{each.paid ? "Paid" : "Pending"}</Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="orange"
                              onClick={() =>
                                payFine(each.category, each.meetingId)
                              }
                            >
                              Pay now
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Flex>
          <AlertBox
            size={size}
            message={message}
            type={type}
            setSize={setSize}
          />
        </Flex>
      </Flex>
    </>
  );
};
export default ClientDashboard;
