import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Avatar,
  Alert,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  TableContainer,
  Thead,
  Table,
  Th,
  Tbody,
  Tr,
  Td,
  Badge,
} from "@chakra-ui/react";
import { Group, Money } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDownload, FaFile } from "react-icons/fa";
import Select from "react-select";
import {
  checkAuthStatusAndReturnToken,
  clientPost,
  dateDescription,
  fetchData,
  formatNumber,
  getTimeDetails,
} from "../../../Commons";
import {
  allLoans,
  loanApplicationDetail,
  loanDataType,
  sessionType,
  treasurerHomePageType,
} from "../../types";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { PDFDownloadLink } from "@react-pdf/renderer";

const LoanComponent = () => {
  const [loans, setLoan] = useState<loanApplicationDetail[]>([]);
  const [loanSummary, setLoanSummary] = useState<treasurerHomePageType | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState(0);
  const router = useRouter();
  const [memberId, setMemberId] = useState("");
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState("");
  const [authToken, setToken] = useState("");
  const [reportData, setReportData] = useState<allLoans | null>(null);
  const [loanFilter, setLoanFilter] = useState("");
  const [total, setTotal] = useState(0);

  const initToken = async () => {
    const userToken = (await getSession()) as sessionType;
    if (userToken.user.access_token.length > 0) {
      setToken(userToken.user.access_token);
      return userToken.user.access_token;
    }
  };
  useEffect(() => {
    const getLoans = async () => {
      const fetchToken = await initToken();
      if (!fetchToken) {
        return;
      }
      const loanApplications = await fetchData({
        url: "loan/all/pending",
        token: fetchToken,
      });
      if (loanApplications) {
        return loanApplications;
      } else {
        throw new Error("Something went wrong");
      }
    };
    // fetch all loans
    const getReportData = async () => {
      const session = (await getSession()) as sessionType;
      const data = await fetchData({
        token: session.user.access_token,
        method: "GET",
        url: "loan/loan/all",
      });
      console.log(data);
      if (data) {
        setReportData(data);
      }
    };
    const getLoanSummary = async () => {
      const fetchToken = await initToken();
      if (!fetchToken) {
        return;
      }
      const loanSummary = await fetchData({
        url: "admin/treasurer/home",
        token: fetchToken,
      });
      if (typeof loanSummary !== ("number" || "undefined")) {
        return loanSummary;
      }
    };
    getReportData();
    getLoans()
      .then((e) => setLoan(e))
      .catch((error) => console.log(error));
    getLoanSummary()
      .then((success) => setLoanSummary(success))
      .catch((error) => console.log(error));
  }, [authToken, router]);
  const payLoanManually = async (amount: number, memberId: string) => {
    const fetchToken = await initToken();
    if (!fetchToken) {
      return;
    }
    if (amount < 1) {
      setStatus(0);
      setMessage("Amount must be KES 1 and above");
      return;
    }
    const repay = await clientPost({
      url: `loan/client/repay?amount=${amount}&memberId=${memberId}`,
      method: "POST",
      token: fetchToken,
    });
    if (repay == 200) {
      console.log("Success");
      setStatus(200);
      router.reload()
    } else {
      console.log("Something went wrong" + repay);
      setStatus(0);
      setMessage("Processing failed");
    }
  };

  return (
    <>
      <Flex
        width={["98%"]}
        direction="column"
        position="relative"
        gap={5}
        mx="auto"
      >
        <Heading fontFamily={"body"} fontWeight="normal" fontSize={"2xl"}>
          Loan Management
        </Heading>

        <Flex
          mt={5}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={[6, 6, 6, 2]}
          direction={["column", "column", "column", "row"]}
        >
          <Flex
            bg={"white"}
            flex={1}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Flex p={3} alignItems="center" gap={3}>
              <Box
                p={5}
                bg="blue.50"
                rounded="md"
                color={"blue.500"}
                display="flex"
                justifyContent={"center"}
                alignItems="center"
              >
                <Group color="inherit" />
              </Box>
              <Flex direction={"column"}>
                <Text color="gray.500">Borrowers</Text>
                <Text fontWeight="bolder" fontSize="2xl">
                  {loanSummary?.numberOfLoansOutstanding}
                </Text>
              </Flex>
            </Flex>
            <Flex mr={3} direction="column-reverse">
              <Text color="green.500" fontSize=".8rem">
                Total this year
              </Text>
              <Text fontWeight="bold" color="blue.500" fontSize={"2xl"}>
                {loanSummary?.numberOfLoansGiven}
              </Text>
            </Flex>
          </Flex>
          <Flex
            bg={"white"}
            flex={1}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Flex p={3} gap={3} alignItems="center">
              <Box
                p={5}
                bg="red.100"
                rounded="md"
                color={"red.500"}
                display="flex"
                justifyContent={"center"}
                alignItems="center"
              >
                <Money color="inherit" />
              </Box>
              <Flex direction={"column"}>
                <Text color="gray.500">Money out</Text>
                <Text fontWeight="bolder" fontSize="xl" color="blue.500">
                  KES{" "}
                  {loanSummary !== null &&
                    formatNumber(
                      loanSummary?.amountLoaned - loanSummary?.amountPaid
                    )}
                </Text>
              </Flex>
            </Flex>
            <Flex mr={3} direction="column-reverse">
              <Text color="gray.500" fontSize=".8rem">
                Total this year
              </Text>
              <Text fontWeight="bold" fontSize={"xl"} color="green.400">
                KES{" "}
                {loanSummary !== null &&
                  formatNumber(loanSummary?.amountLoaned)}
              </Text>
            </Flex>
          </Flex>
          <Flex
            bg={"white"}
            flex={1}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Flex p={3} gap={3} alignItems="center">
              <Box
                p={5}
                bg="blue.50"
                rounded="md"
                color={"blue.500"}
                display="flex"
                justifyContent={"center"}
                alignItems="center"
              >
                <Group color="inherit" />
              </Box>
              <Flex direction={"column"}>
                <Text color="gray.500">Applications</Text>
                <Text fontWeight="bolder" fontSize="2xl" color="blue.300">
                  {loans.length}
                </Text>
              </Flex>
            </Flex>
            <Flex mr={3} direction="column-reverse">
              <Text color="gray.500" fontSize={".8rem"}>
                New
              </Text>
              <Text fontWeight="bold" fontSize={"2xl"} color="green.400">
                {loans.slice(0, 3).length}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          gap={4}
          flexWrap="wrap"
          fontSize="xs"
          direction={["column", "column", "row", "row"]}
        >
          <Flex
            direction="column"
            bg="white"
            p={4}
            flex={1}
            overflow="auto"
            rounded="md"
            overflowX="auto"
          >
            {/* Applications */}
            <Text>New Applications</Text>

            {loans.length > 0 ? (
              loans?.map((each) => {
                return (
                  <Flex mt={4} key={each.owner}>
                    <Flex flex={1} justifyContent="space-between">
                      <Flex gap={4} alignItems="center">
                        <Avatar size="sm"></Avatar>
                        <Flex direction="column">
                          <Text>{each.fullName}</Text>
                          <Text color="gray">{each.memberId}</Text>
                        </Flex>
                      </Flex>
                      <Flex
                        direction="column"
                        display={["none", "none", "flex"]}
                      >
                        <Text fontWeight="bold">KES {each.amount}</Text>
                        <Text color="gray">{each.duration} months</Text>
                      </Flex>
                      <Flex direction={"column"} display={["none", "flex"]}>
                        <Text>Mode</Text>
                        <Text color="gray">
                          {each.owner ? "Self" : "Guarantor"}
                        </Text>
                      </Flex>
                      <Flex
                        direction="column"
                        p={2}
                        alignSelf="center"
                        bg="green.300"
                        color="white"
                        rounded="md"
                        cursor="pointer"
                        _hover={{ bg: "green.500" }}
                      >
                        <Link href={`loans/${each.loanId}`}>Work on it</Link>
                      </Flex>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <Alert
                colorScheme="red"
                rounded="md"
                justifySelf={"center"}
                mt={10}
              >
                Nothing to show here
              </Alert>
            )}
          </Flex>
          {/* Loanees */}
          <Flex
            direction="column"
            bg="white"
            p={4}
            flex={1}
            fontSize="xs"
            rounded="md"
          >
            {/* Applications */}
            <Text>Outstanding Loans</Text>
            {loanSummary !== null &&
            typeof loanSummary !== "undefined" &&
            loanSummary?.pendingLoans?.length > 0 ? (
              loanSummary.pendingLoans.map((each1) => {
                return (
                  <Flex flex={1} mt={4} key={each1.memberId}>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      flex={1}
                    >
                      <Flex gap={4}>
                        <Avatar size="sm"></Avatar>
                        <Flex direction="column">
                          <Text>{each1.name}</Text>
                          <Text color={"gray"}>{each1.memberId}</Text>
                        </Flex>
                      </Flex>
                      <Flex direction="column">
                        <Text fontWeight="bold">
                          KES {formatNumber(each1.amount)}{" "}
                        </Text>
                        <Text color="red.400">
                          KES{" "}
                          {formatNumber(parseInt(each1.interest.toFixed(2)))}
                        </Text>
                      </Flex>
                      <Flex
                        direction="column"
                        display={["none", "none", "flex"]}
                      >
                        <Text color="gray">Due Date</Text>
                        <Text>
                          {dateDescription(getTimeDetails(each1.dueDate).date)}
                        </Text>
                      </Flex>
                      <Flex direction="column" gap={3}>
                        <Button colorScheme="gray" size="xs">
                          Reminder
                        </Button>
                        <Button
                          colorScheme="green"
                          size="xs"
                          onClick={() => {
                            setMemberId(each1.memberId);
                            onOpen();
                          }}
                        >
                          Pay
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <Alert
                mt={10}
                color="green.600"
                fontWeight={"bold"}
                rounded="md"
                colorScheme="green"
              >
                All borrowers have paid back their debts
              </Alert>
            )}
          </Flex>
          <Flex bg="white" width="100%">
            <TableContainer width="80%" margin="auto" padding={10}>
              <Heading fontSize={"1.3rem"} color="GrayText" mb={5}>
                All Approved Loans
              </Heading>
              <Input
                type="text"
                value={loanFilter}
                width={["100%", "50%", "30%"]}
                onChange={(e) => setLoanFilter(e.target.value)}
                placeholder={"Search"}
              />
              <Table>
                <Thead>
                  <Th>Name</Th>
                  <Th>Member ID</Th>
                  <Th>Amount Borrowed</Th>
                  <Th>Initial Interest</Th>
                  <Th>Overdue Charge</Th>
                  <Th>Outstanding Amount</Th>
                  <Th>Status</Th>
                  <Th>Total Unpaid</Th>
                </Thead>
                <Tbody>
                  {reportData !== null &&
                    reportData!
                      .filter((each) => {
                        return (
                          each.member.includes(loanFilter) ||
                          each.status.includes(loanFilter) ||
                          each.outstandingAmount.toString().includes(loanFilter)
                        );
                      })
                      .map((loan, index) => {
                        return (
                          <Tr>
                            <Td>{loan.member}</Td>
                            <Td>{loan.memberId}</Td>
                            <Td>KES {loan.amount}</Td>
                            <Td>KES {loan.initialInterest}</Td>
                            <Td>KES {loan.extraInterest}</Td>
                            <Td>KES {loan.outstandingAmount}</Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  loan.status === "Completed" ? "green" : "red"
                                }
                              >
                                {loan.status}
                              </Badge>
                            </Td>
                            <Td fontWeight="bolder">
                              {" "}
                              KES{" "}
                              {reportData
                                .slice(0, index)
                                .reduce(
                                  (prev, current) =>
                                    prev + current.outstandingAmount,
                                  loan.outstandingAmount
                                )}
                            </Td>
                          </Tr>
                        );
                      })}
                 
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay  />
          <ModalContent>
            <ModalHeader bg="twitter.500" color={"white"} p={2}>
              Confirm Manual Payment
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <FormControl isInvalid={status === 0}>
                <FormLabel>Enter amount to Pay</FormLabel>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                />
                <FormErrorMessage>{message}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="twitter"
                onClick={async () => {
                  await payLoanManually(amount, memberId);
                  if (status === 200) {
                    onClose();
                  }
                }}
              >
                Pay Now
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};
export default LoanComponent;
