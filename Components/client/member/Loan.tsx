import {
  Flex,
  Box,
  Select,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Button,
  Alert,
} from "@chakra-ui/react";
import getTime from "date-fns/getTime";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  ClientContext,
  dateDescription,
  fetchData,
  formatNumber,
  getTimeDetails,
  TokenContext,
} from "../../../Commons";
import { loanDataType, sessionType } from "../../types";

const Loan = () => {
  const tokenContext = useContext(TokenContext);
  const [clientSession, setSession] = useState<sessionType|null>(null)
  const [loading, setLoading] = useState(false);
  const [loanData, setLoanData] = useState<loanDataType | null>(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchLoanData = async () => {
      setLoading(true);
      const authToken = (await getSession()) as sessionType;
      if (authToken) {
        setToken(authToken.user.access_token);
        setSession(authToken)
      }


      // Check the username+
      const getLoanResult = await fetchData({
        token: authToken.user.access_token,
        url: "loan/client/all",
        method: "GET",
      });
      console.log(getLoanResult);
      setLoanData(getLoanResult);
    };
    fetchLoanData();
  }, [token, tokenContext.token]);

  return (
    <>
      <Flex p={5} direction="column" position="relative">
        <Text fontFamily={"body"} fontSize="xl">
          Good Afternoon,{" "}
          <span style={{ fontWeight: "bolder" }}>
           { clientSession !==null?clientSession?.user.fullName:"User"}
          </span>
        </Text>
      { typeof loanData !=="undefined" &&loanData !==null?  <Flex
          width="100%"
          bg="white"
          p={10}
          direction="column"
          mt={10}
          rounded="md"
        >
          <Flex
            width="100%"
            mx={"auto"}
            mb={10}
            gap={[2, 3, 4]}
            justifyContent="center"
          >
            <Box p={3} bg={"red.100"} minWidth={"30%"} rounded="md">
              <Text
                fontSize={["1.1rem", "1.2rem", "1.5rem"]}
                fontWeight="bolder"
              >
                {loanData?.loanSummary.declined}
              </Text>
              <Text fontSize=".9rem" color="gray">
                Declined applications
              </Text>
            </Box>
            <Box p={3} bg={"red.100"} rounded="md">
              <Text fontSize={["1.1rem", "1.2rem", "1.4rem"]}>
                <span style={{ fontSize: "1rem" }}> KES </span>
                <span
                  style={{
                    fontWeight: "bolder",

                    padding: 2,
                    backgroundColor: "red.100",
                    minWidth: "30%",
                  }}
                >
                  {loanData !== null
                    ? formatNumber(loanData?.loanSummary.allTimeInterest)
                    : ""}
                </span>
              </Text>
              <Text color="gray" size=".9rem">
                Interest Charged
              </Text>
            </Box>
            <Box p={3} bg={"green.100"} rounded="md">
              <Text fontSize={["1.1rem", "1.2rem", "1.4rem"]}>
                <span style={{ fontSize: ".9rem" }}> KES </span>
                <span
                  style={{
                    fontWeight: "bolder",
                    padding: 2,
                    backgroundColor: "blue.100",
                    minWidth: "30%",
                  }}
                >
                  {loanData !== null
                    ? formatNumber(loanData?.loanSummary.allTimeBorrowing)
                    : ""}
                </span>
              </Text>
              <Text color="gray">Amount Borrowed</Text>
            </Box>
          </Flex>
          <Box
            display={"flex"}
            width="100%"
            gap={2}
            flexDirection={["column", "column", "row"]}
            justifyContent={"space-between"}
            alignItems={["flex-start", "flex-start", "center"]}
          ></Box>
          <TableContainer width="100%" mt={4}>
            <Text color="gray" mb={8}>
              All Approved loans
            </Text>
            <Table size="md" variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>Date approved</Th>
                  <Th>Status</Th>
                  <Th>Due Date</Th>
                  <Th>Amount</Th>
                  <Th>Expected Interest</Th>

                  <Th>Overflow Cost</Th>
                  <Th>Loan Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loanData !== null &&
                  loanData.loanResponseList.map((each) => {
                    return (
                      <Tr key={each.loanId}>
                        <Td>
                          {dateDescription(
                            getTimeDetails(each.dateApproved).date
                          )}{" "}
                          {getTimeDetails(each.dateApproved).time}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              each.status.startsWith("C") ? "green" : "yellow"
                            }
                          >
                            {each.status}
                          </Badge>
                        </Td>
                        <Td>{each.initialDuration}</Td>
                        <Td isNumeric>KES {each.amount}</Td>
                        <Td isNumeric>KES {each.initialInterest}</Td>

                        <Td isNumeric>KES {each.extraInterest}</Td>
                        <Td isNumeric>KES {each.outstandingAmount}</Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>:<Alert colorScheme="red">You have not applied for any loan so far!</Alert>}
        <Button
          as={"a"}
          href="/client/loan/apply"
          position="absolute"
          top={7}
          right="0"
          colorScheme="blue"
          textTransform={"uppercase"}
        >
          Apply for a loan
        </Button>
      </Flex>
    </>
  );
};

export default Loan;
