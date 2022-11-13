import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaFilePdf, FaSearch } from "react-icons/fa";
import {
  Document,
  Page,
  View,
  Text as PDFText,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useContext, useEffect, useState } from "react";
import { fetchData, TokenContext } from "../../../Commons";
import { sessionType, transactionType } from "../../types";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { TrxPDF } from "../../reports/Transaction";

const Transaction = () => {
  const tokenData = useContext(TokenContext);
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [startIndex, setIndex] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [authentication, setAuthentication] = useState({
    name: "",
    memberId: "",
    phone: "",
  });

  useEffect(() => {
    const transactionData = async () => {
      setLoading(true);
      const session = (await getSession()) as sessionType;
      if (session?.user.access_token) {
        const transactionResult = await fetchData({
          token: session.user.access_token,
          url: "transactions",
          method: "GET",
        });
        const userAuth = session.user;
        setAuthentication({
          name: userAuth.fullName,
          memberId: userAuth.memberId,
          phone: userAuth.phone,
        });

        setTransactions(transactionResult);
      }

      setLoading(false);
    };

    transactionData();
  }, [tokenData]);

  return (
    <>
      <Flex
        direction="column"
        p={5}
        bg="white"
        mt={10}
        width="95%"
        mx="auto"
        rounded="md"
      >
        <Flex gap={4} justifyContent="space-between" alignItems={"center"}>
          <Box>
            <Heading fontFamily={"body"} fontSize="1.1rem" color="#0F1419">
              TRANSACTIONS
            </Heading>
            <Text color="gray" fontSize=".8rem" mt={2}>
              All your Transactions
            </Text>
          </Box>
          <InputGroup width={"12rem"} alignItems="center">
            <InputLeftElement pointerEvents={"none"}>
              <FaSearch color="#d3d3d3" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </InputGroup>
        </Flex>
        {transactions !== null && transactions.length === 0 ? (
          <Alert mt={4} rounded="md" colorScheme="blue" color="blue.800">
            You have not made any transactions
          </Alert>
        ) : loading ? (
          <Alert>
            Fetching your data <Spinner />
          </Alert>
        ) : (
          <TableContainer mt={3}>
            <Table size="sm" variant={"unstyled"}>
              <Thead>
                <Tr>
                  <Th>Code</Th>
                  <Th>Category</Th>
                  <Th>Amount</Th>
                  <Th>Transaction Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody alignItems="center">
                {transactions !== null &&
                  transactions
                    .slice(startIndex, startIndex + 5)
                    .filter((each) => each.transactionId.includes(filterText))
                    .map((each) => {
                      return (
                        <Tr key={each.transactionId}>
                          {" "}
                          <Td color="green.400">{each.transactionId}</Td>
                          <Td>{each.transactioncategory}</Td>
                          <Td>KES {each.transactionAmount}</Td>
                          <Td>
                            {each.transactionDate.split("T")[0]}{" "}
                            {each.transactionDate.split("T")[1].split(".")[0]}
                          </Td>
                          <Td>
                            <Badge colorScheme="green">Completed</Badge>
                          </Td>
                        </Tr>
                      );
                    })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          mt={3}
          gap={4}
        >
          <Box gap={4} flex={2} display="flex" justifyContent="center">
            {Array.from(
              Array(
                transactions !== null && Math.ceil(transactions.length / 5)
              ),
              (x, index) => index
            ).map((each: any) => (
              <Button
                size="sm"
                key={each}
                onClick={() => setIndex(each + 6)}
                colorScheme={startIndex == each + 6 ? "blue" : "gray"}
              >
                {each + 1}
              </Button>
            ))}
          </Box>
          <PDFDownloadLink
            fileName="some.pdf"
            document={
              <TrxPDF transactions={transactions} sender={authentication} />
            }
          >
            <Button
              colorScheme="red"
              size="sm"
              gap={2}
              disabled={
                transactions !== null && transactions.length == 0 ? true : false
              }
              // Download the pdf here
              // onClick={async () => {
              //   const request = await axios.post(
              //     "/api/reports/transaction",

              //     { transactions },
              //     { responseType: "blob" }
              //   );
              //   if (request.data) {
              //     window.open(
              //       window.URL.createObjectURL(
              //         new Blob([request.data], { type: "application/pdf" })
              //       )
              //     );
              //   }
              // }}
            >
              Download
              <FaFilePdf />
            </Button>
          </PDFDownloadLink>
        </Box>
      </Flex>
    </>
  );
};
const Tra = () => {
  return (
    <Document>
      <Page>
        <View>
          <PDFText>Hello</PDFText>
        </View>
      </Page>
    </Document>
  );
};

export default Transaction;
//   <Flex alignItems="center" gap={7} width="100%">
//     <Box>
//       <FormLabel fontWeight={"bolder"}>From</FormLabel>
//       <Input type="date" size="sm" />
//     </Box>
//     <Box>
//       <FormLabel fontWeight={"bolder"}>To</FormLabel>
//       <Input type="date" size="sm" />
//     </Box>
//   </Flex>;
