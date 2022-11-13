import {
  Flex,
  TableContainer,
  Table,
  Text,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Alert,
  Badge,
  Button,
  Box,
} from "@chakra-ui/react";
import { db_application } from "../../types";
import differenceInDays from "date-fns/differenceInDays/index.js";
import { add } from "date-fns/esm";
import { addDays } from "date-fns";
const Pending = (props: any) => {
  const pending: Array<db_application> = props.pending;

  if (props === false) {
    return <Box>The server encountered an error while rendering this page</Box>;
  }

  return (
    <>
      <Flex width={["95%", "90%"]} mx="auto" direction="column">
        <Text fontSize="1.5rem" mb={4}>
          Admitted applications Pending Membership fee payment
        </Text>
        {pending.length == 0 ? (
          <Alert colorScheme="blue">
            Pending applications will be shown here
          </Alert>
        ) : (
          <TableContainer bg="white" fontSize={".8rem"}>
            <Table>
              <Thead>
                <Th>Application Ref</Th>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Revoked in</Th>
              </Thead>
              <Tbody>
                {pending.map((each: db_application) => {
                  return (
                    <Tr key={each.id}>
                      <Td>{each.applicationRef}</Td>
                      <Td>
                        {each.firstName} {each.lastName}
                      </Td>
                      <Td>{each.phoneNumber}</Td>
                      <Td>{each.emailAddress}</Td>
                      <Td>
                        {differenceInDays(
                          addDays(new Date(each.actedUponAt.split("T")[0]), 3),
                          new Date()
                        ) <= 0 ? (
                          <Box gap={2} width="100%" display={"flex"}>
                            <Badge size="sm" colorScheme="red">
                              Overdue
                            </Badge>
                          </Box>
                        ) : (
                          <Badge
                            rounded="md"
                            colorScheme={
                              differenceInDays(
                                addDays(
                                  new Date(each.actedUponAt.split("T")[0]),
                                  3
                                ),
                                new Date()
                              ) >= 2
                                ? "green"
                                : "red"
                            }
                          >
                            {" "}
                            {differenceInDays(
                              addDays(
                                new Date(each.actedUponAt.split("T")[0]),
                                3
                              ),
                              new Date()
                            )}{" "}
                            Days
                          </Badge>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </>
  );
};
export default Pending;
