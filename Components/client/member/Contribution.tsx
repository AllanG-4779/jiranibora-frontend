import {
  Alert,
  Badge,
  Box,
  Flex,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ClientContext, fetchData, TokenContext } from "../../../Commons";
import { membercontribution } from "../../types";

const Contribution = () => {
  const clientdata = useContext(ClientContext);
  const sessionToken = useContext(TokenContext);
  const [contribution, setContribution] = useState<membercontribution[]>([]);

  useEffect(() => {
    const getAllContribution = async () => {
      const data = await fetchData({
        token: sessionToken.token,
        method: "GET",
        url: "cont/all",
      });
     if(data) return data
    };
    getAllContribution().then(result=> {
      if (result) setContribution(result)
    })
  .catch(e=>console.log("Error from fetching contributions is "+ e));
  }, [sessionToken.token]);

  return (
    <>
      <Flex p={5} direction="column">
        <Text fontFamily={"body"} fontSize="xl">
          Good Afternoon,{" "}
          <span style={{ fontWeight: "bolder" }}>
            {clientdata?.accountHolder.split(" ")[0]}
          </span>
        </Text>
        <Flex
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
                fontSize={["1.2rem", "1.5rem", "1.8rem"]}
                fontWeight="bolder"
              >
                {sessionToken.pendingConts}
              </Text>
              <Text color="gray">Pending contributions</Text>
            </Box>
            <Box p={3} bg={"red.100"} rounded="md">
              <Text fontSize={["1.2rem", "1.5rem", "1.8rem"]}>
                <span style={{ fontSize: "1rem" }}> KES </span>
                <span
                  style={{
                    fontWeight: "bolder",

                    padding: 2,
                    backgroundColor: "red.100",
                    minWidth: "30%",
                  }}
                >
                  {contribution != null
                    ? contribution
                        .map((each) => each.penalty)
                        .reduce((prev, current) => prev + current, 0)
                    : 0}
                </span>
              </Text>
              <Text color="gray">Late payment Penalties</Text>
            </Box>
          </Flex>
          {/* <Box
            display={"flex"}
            width="100%"
            gap={2}
            flexDirection={["column", "column", "row"]}
            justifyContent={"space-between"}
            alignItems={["flex-start", "flex-start", "center"]}
          >
            <Text flex={2} mb={3}>
              View Contributions for
            </Text>
            <Box flex={2}>
              <Select minWidth="10rem">
                <option>2021</option>
                <option>2022</option>
              </Select>
            </Box>
          </Box> */}
          {contribution == null || contribution.length <= 0 ? (
            <Alert mt={3}>You have not made any contribution</Alert>
          ) : (
            <TableContainer width="100%" mt={4}>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Month</Th>
                    <Th>Contribution ID</Th>
                    <Th>Status</Th>
                    <Th>Penalty</Th>
                    <Th>Paid On</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contribution.map((each, index) => {
                    return (
                      <Tr key={each.contributionId}>
                        <Td>{index + 1}</Td>
                        <Td>{each.month}</Td>
                        <Td>{each.contributionId}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              each.status.startsWith("L") ? "red" : "green"
                            }
                            p={1}
                          >
                            {each.status}
                          </Badge>
                        </Td>
                        <Td>{each.penalty}</Td>
                        <Td>{each.date.split("T")[0]}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default Contribution;
