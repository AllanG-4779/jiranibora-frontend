import {
  Flex,
  TableContainer,
  Table,
  Text,
  Thead,
  Th,
  Tbody,
  Tr,
  Box,
  Td,
  Alert,
} from "@chakra-ui/react";
import { db_application } from "../../types";

const Disapproved = (props: any) => {
  const declined: Array<db_application> = props.disapproved;
  if (declined.length == 0 && !props.success) {
    return <Box>{"The server couldn't render this page correctly"}</Box>;
  }
  return (
    <>
      <Flex width={["95%", "90%"]} mx="auto" direction="column">
        <Text fontSize="1.5rem" mb={4}>
          Rejected Applications
        </Text>
        {declined.length < 1 ? (
          <Alert colorScheme="red" width="100%">
            Disapproved Applications will be shown here
          </Alert>
        ) : (
          <TableContainer bg="white">
            <Table fontSize="sm">
              <Thead>
                <Th>Application Ref</Th>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Reason</Th>
              </Thead>
              <Tbody>
                {declined.map((each: db_application) => {
                  return (
                    <Tr key={each.id}>
                      <Td>{each.applicationRef}</Td>
                      <Td>
                        {each.firstName} {each.lastName}
                      </Td>
                      <Td>{each.phoneNumber}</Td>
                      <Td>{each.emailAddress}</Td>
                      <Td color="gray.500">{each.reasonIfDeclined}</Td>
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
export default Disapproved;
