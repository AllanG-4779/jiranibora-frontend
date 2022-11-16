import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Link as ChakraLink,
  Select,
  Text,
  Tooltip,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Logout } from "@mui/icons-material";
import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { BiMenu, BiSave } from "react-icons/bi";
import { FaFileDownload, FaHistory, FaLock, FaUser } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { clientData, contribution, sessionType } from "../../types";
import HamburgMenu from "./Hamburg";
import {
  ClientContext,
  clientPost,
  fetchData,
  formatNumber,
  isTokenExpired,
  TokenContext,
} from "../../../Commons";
import AlertBox from "../Signup/Alert";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MemberEarningReport, {
  summary,
} from "../../reports/MemberEarningReport";
type content = {
  children: ReactNode;
};

const MemberLayout = ({ children }: content) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clientdata, setClientData] = useState<clientData | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [quickPayment, setQuickPayment] = useState("Loan");
  const [pendingContribution, setPendingContribution] = useState<
    contribution[] | null
  >(null);
  const [amount, setAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [currentContribution, setCurrentContribution] = useState("");
  const [size, setSize] = useState(-100);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [pendingConts, setPendingConts] = useState(0);
  const [memberReport, setMemberReport] = useState<summary | null>(null);

  const checkActive = (path: string) => {
    return true && router.pathname == path;
  };
  const totalAmount =
    clientdata?.accountSummary.contributions -
    clientdata?.accountSummary.fineAndPenalties -
    clientdata?.accountSummary.loanAndInterest;
  // check for authentication

  useEffect(() => {
    const securePage = async () => {
      const session = (await getSession()) as sessionType;
      if (!session || isTokenExpired(session.user.access_token)) {
        await router.push("/login");
      } else {
        setSessionToken(session.user.access_token);
        // get the initial state
        const result = (await fetchData({
          url: "user",
          token: session.user.access_token,
          method: "",
        })) as clientData;
        // get the contribution for a member
        const pendingCont = (await fetchData({
          token: session.user.access_token,
          url: "contributions",
          method: "GET",
        })) as contribution[];
        const summary = await fetchData({
          token: session.user.access_token,
          method: "GET",
          url: "member/earning",
        });
        console.log(summary);

        setMemberReport({
          sender: {
            memberId: session.user.memberId,
            phoneNumber: session.user.phone,
            name: session.user.fullName,
          },
          data: summary,
        });
        console.log(memberReport);

        setLoading(false);
        setClientData(result);
        setPendingContribution(pendingCont);
        setPendingConts(pendingCont.length);
      }
    };

    securePage().then((r) => console.log(r));
    loading ? console.log("loading") : console.log(clientdata);
  }, [loading, paymentLoading, sessionToken]);

  // Make Payment i.e Contribution & Loan
  const payLoan = async (amount?: string, contributionId?: string) => {
    setPaymentLoading(true);

    const payLoanResult = await clientPost({
      token: sessionToken,
      url:
        quickPayment === "Loan"
          ? `loan/client/repay?amount=${parseFloat(amount!)}`
          : `cont/contribute?contributionId=${contributionId}`,
      method: "POST",
    });
    console.log(`I am making ${quickPayment} with token ${sessionToken}`);
    console.log(quickPayment, currentContribution);
    setPaymentLoading(false);
    setAmount("");
    if (payLoanResult >= 299) {
      setSize(0.1);
      setType("error");
      setMessage(
        payLoanResult == 404
          ? "You do not have any outstanding loan"
          : "Unknown error occured"
      );
    } else {
      setSize(0.1);
      setType("success");
      setMessage("Success! Check your phone to complete MPESA transaction");
    }
    setTimeout(() => {
      setSize(-100);
    }, 5000);
  };

  const before = {
    width: "3px",
    height: "100%",
    content: `""`,
    backgroundColor: "dodgerblue",
  };

  return (
    <ClientContext.Provider value={clientdata}>
      {sessionToken.length <= 0 ? (
        <VStack alignItems={"center"}>
          {" "}
          <Spinner />
        </VStack>
      ) : (
        <TokenContext.Provider value={{ token: sessionToken, pendingConts }}>
          {/* Top navbar */}
          <Flex
            bg="#0F1419"
            color="white"
            height={"4rem"}
            display={["flex", "flex", "flex", "none"]}
            width="100%"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box ml={4} onClick={() => setOpen(!open)}>
              <BiMenu fontSize="2rem" />
            </Box>
            <Text fontFamily={"logo"} fontSize="1.5rem">
              JiraniBora
            </Text>
            <Box mr={4}>
              <Avatar src="../../../profile.jpeg" />
            </Box>
          </Flex>
          <Flex
            h="100vh"
            maxWidth="2000px"
            overflow={"auto"}
            direction={["column", "column", "column", "row"]}
            bg={"#f2f2f2"}
          >
            {/* Sidebar  */}
            <HamburgMenu open={open} before={before} setOpen={setOpen} />

            <Flex
              width="20%"
              height={"100%"}
              // position={"absolute"}
              // left={open ? 0 : "-60%"}
              bg="#0F1419"
              color={"#fff"}
              display={["none", "none", "none", "flex"]}
              direction={"column"}
              shadow="md"
              fontSize={["xs", "xs", "xs", "normal"]}
              justifyContent="space-between"
            >
              <Flex direction="column">
                <Heading
                  fontFamily={"logo"}
                  fontSize="1.8rem"
                  mt={4}
                  ml={"0.9em"}
                >
                  JiraniBora
                </Heading>
                {/* Navbar items */}
                <Flex
                  as="nav"
                  direction="column"
                  mt={20}
                  className="sidebar"
                  gap={5}
                >
                  <Flex
                    className={
                      checkActive("/client/my")
                        ? "sidebar-item active"
                        : "sidebar-item"
                    }
                    _before={checkActive("/client/my") ? before : {}}
                  >
                    <ChakraLink className="sidebar-icon" mt={2}>
                      <Icon as={FiHome}></Icon>
                    </ChakraLink>
                    <Link className="sidebar-text" href={"/client/my"} passHref>
                      <a>Dashboard</a>
                    </Link>
                  </Flex>
                  <Flex
                    className={
                      checkActive("/client/contribution")
                        ? "sidebar-item active"
                        : "sidebar-item"
                    }
                    _before={checkActive("/client/contribution") ? before : {}}
                  >
                    <ChakraLink className="sidebar-icon">
                      <Icon as={BiSave}></Icon>
                    </ChakraLink>
                    <Link
                      className="sidebar-text"
                      href="/client/contribution"
                      passHref
                    >
                      <a>Contributions</a>
                    </Link>
                  </Flex>
                  <Flex
                    className={
                      checkActive("/client/loan")
                        ? "sidebar-item active"
                        : "sidebar-item"
                    }
                    _before={checkActive("/client/loan") ? before : {}}
                  >
                    <ChakraLink className="sidebar-icon">
                      <Icon as={FaLock}></Icon>
                    </ChakraLink>
                    <Link className="sidebar-text" href="/client/loan" passHref>
                      <a>Loan Statements</a>
                    </Link>
                  </Flex>
                  <Flex
                    className={
                      checkActive("/client/transaction")
                        ? "sidebar-item active"
                        : "sidebar-item"
                    }
                    _before={checkActive("/client/transaction") ? before : {}}
                  >
                    <ChakraLink className="sidebar-icon">
                      <Icon as={FaHistory}></Icon>
                    </ChakraLink>
                    <Link
                      className="sidebar-text"
                      href="/client/transaction"
                      passHref
                    >
                      <a>Transaction History</a>
                    </Link>
                  </Flex>
                  <Flex
                    className={
                      checkActive("/client/transaction")
                        ? "sidebar-item active"
                        : "sidebar-item"
                    }
                    _before={checkActive("/client/profile") ? before : {}}
                  >
                    <ChakraLink className="sidebar-icon ">
                      <Icon as={FaUser}></Icon>
                    </ChakraLink>
                    <Link
                      className="sidebar-text"
                      href="/client/profile"
                      passHref
                    >
                      <a>Profile </a>
                    </Link>
                  </Flex>
                </Flex>
              </Flex>
              {/* Avatar */}
              <Flex
                direction={"row"}
                display={["none", "none", "none", "flex"]}
                alignItems={"center"}
                p={2}
                mb={6}
                gap={3}
                mr={3}
                position="relative"
                color="gray.200"
                justifyContent="center"
                cursor="pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
                bg="primary.900"
                transition="all 300ms ease-in-out"
                width="100%"
                _hover={{ bg: "primary.900" }}
              >
                <Logout />
                <Text fontFamily="Arial" color="#afafaf">
                  Logout
                </Text>
              </Flex>
            </Flex>

            {/*  Content */}
            <Flex
              w={["100%", "100%", "100%", "65%"]}
              minH="100vh"
              direction="column"
              p={3}
              overflow="auto"
              bg="#f2f2f2"
              gap={6}
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              onClick={() => setOpen(false)}
            >
              {children}
            </Flex>
            {/* Notification */}
            <Flex
              width={["100%", "100%", "30%"]}
              direction="column"
              bg="#f2f2f2"
              mt={[10, 10, 0]}
            >
              {clientdata === null ? (
                <Flex
                  direction="column"
                  mt={4}
                  p={4}
                  flex={1}
                  width="90%"
                  mx="auto"
                  shadow="sm"
                  alignItems={"center"}
                  justifyContent="center"
                  rounded="md"
                >
                  {" "}
                  <Spinner />
                </Flex>
              ) : (
                <Flex
                  direction="column"
                  mt={4}
                  p={4}
                  bg="#0F1419"
                  width="90%"
                  mx="auto"
                  shadow="sm"
                  rounded="md"
                >
                  <Text
                    fontWeight={"semibold"}
                    color="white"
                    textTransform={"uppercase"}
                  >
                    Account Summary
                  </Text>
                  <Flex mt={4} gap={4} justifyContent="space-between">
                    <Text color="gray" gap={4} p={2}>
                      Savings
                    </Text>
                    <Text color={"white"} opacity={0.6} p={0.5} px={2}>
                      KES{" "}
                      {formatNumber(clientdata?.accountSummary.contributions)}
                    </Text>
                  </Flex>
                  <Flex mt={4} gap={4} justifyContent="space-between">
                    <Text color="gray" p={0.5} px={2} rounded={"md"}>
                      Loans
                    </Text>
                    <Text
                      color={"white"}
                      opacity={0.6}
                      p={0.5}
                      px={2}
                      rounded="md"
                    >
                      -KES{" "}
                      {formatNumber(
                        clientdata?.accountSummary.loanAndInterest.toFixed(2)
                      )}
                    </Text>
                  </Flex>
                  <Flex mt={4} gap={4} justifyContent="space-between">
                    <Text color="gray" p={0.5} px={2} rounded="md">
                      Fines & Penalties
                    </Text>
                    <Text
                      color={"white"}
                      opacity={0.6}
                      p={0.5}
                      px={2}
                      rounded="md"
                    >
                      -KES{" "}
                      {formatNumber(
                        clientdata?.accountSummary.fineAndPenalties.toFixed(0)
                      )}
                    </Text>
                  </Flex>

                  <Flex mt={4} gap={4} justifyContent="space-between">
                    <Text
                      fontWeight="bolder"
                      color="white"
                      p={0.5}
                      px={2}
                      rounded="md"
                    >
                      Net Shares
                    </Text>
                    <Tooltip label="Net Savings divide by 500">
                      <Text
                        color="white"
                        fontWeight={"bolder"}
                        p={0.5}
                        px={2}
                        rounded="md"
                      >
                        {" "}
                        {totalAmount > 1 ? (totalAmount / 500).toFixed(2) : 0}
                        <sup style={{ marginLeft: "3px" }}>?</sup>
                      </Text>
                    </Tooltip>
                    <PDFDownloadLink
                    fileName={`${memberReport?.sender.memberId}_Report`}
                      style={{ position: "absolute", top:90, right: 400 }}
                      document={<MemberEarningReport report={memberReport!} />}
                    >
                      <Button colorScheme={"blue"} size="sm" gap={3}>
                       <FaFileDownload/> Earning Report
                      </Button>
                    </PDFDownloadLink>
                  </Flex>
                </Flex>
              )}
              {/* Quick actions */}
              <Flex
                width="90%"
                mx={"auto"}
                mt={10}
                direction="column"
                bg="white"
                shadow={"sm"}
                rounded="md"
                mb={10}
              >
                <Text
                  fontSize="0.rem"
                  bg={"#0F1419"}
                  color="white"
                  p={2}
                  roundedTop="md"
                >
                  Quick Payments
                </Text>
                {loading ? (
                  <Spinner />
                ) : (
                  <Box mt={5} display="flex" flexDir="column" gap={4} p={3}>
                    <FormControl>
                      <FormLabel>Payment for</FormLabel>
                      <Select
                        placeholder="Select Payment"
                        variant={"styled"}
                        onChange={(e) => setQuickPayment(e.target.value)}
                      >
                        <option value={"Contribution"}>Contribution</option>

                        <option value="Loan">Loan</option>
                      </Select>
                    </FormControl>
                    {quickPayment === "Loan" ? (
                      <FormControl>
                        <Input
                          placeholder="Enter Amount"
                          onChange={(e) => setAmount(e.target.value)}
                          type="text"
                          value={amount}
                        />
                      </FormControl>
                    ) : (
                      <FormControl>
                        {pendingContribution != null &&
                        pendingContribution?.length > 0 ? (
                          <Select
                            onChange={(e) =>
                              setCurrentContribution(e.target.value)
                            }
                          >
                            <option>Select Contriubution</option>
                            {pendingContribution.map((each) => (
                              <option key={each.contId} value={each.contId}>
                                {each.contId}-{each.month}
                              </option>
                            ))}
                          </Select>
                        ) : (
                          <Text color="red.700" fontSize={".8rem"}>
                            No outstanding contribution
                          </Text>
                        )}
                        <FormHelperText>Select contribution</FormHelperText>
                      </FormControl>
                    )}
                    <FormControl>
                      <Button
                        bg="#0F1419"
                        color="white"
                        _hover={{ bg: "#0F1419", opacity: 0.8 }}
                        size="sm"
                        width="100%"
                        onClick={() => payLoan(amount, currentContribution)}
                      >
                        {paymentLoading ? <Spinner /> : "Pay now"}
                      </Button>
                    </FormControl>
                  </Box>
                )}
                <AlertBox
                  size={size}
                  setSize={setSize}
                  type={type}
                  message={message}
                />
              </Flex>
            </Flex>
          </Flex>
        </TokenContext.Provider>
      )}
    </ClientContext.Provider>
  );
};
export default MemberLayout;
