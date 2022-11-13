import {
  Badge,
  Flex,
  TableContainer,
  Box,
  Text,
  Input,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Avatar,
  Select,
  Button,
  Alert,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdArrowDropDown } from "react-icons/md";

import { db_application } from "../../types";
import Countdown from "react-countdown";
import { milliseconds } from "date-fns/fp";
import { addDays, subDays } from "date-fns";

const Applications = (props: any) => {
  const applications: Array<db_application> = props.applications;

  if (applications.length === 0 && !props.success) {
    return (
      <Alert colorScheme="red">Something went wrong while fetching data</Alert>
    );
  }

  return (
    <>
      <Text fontWeight={"bold"} color="gray.500">
        Application window:{" "}
        <Badge colorScheme="green" letterSpacing={1}>
          Open
        </Badge>
       
      </Text>
      <Flex flexDirection={"column"} gap={2}>
        <TableContainer bg="white" mx="auto" width="100%" p={4} rounded={"lg"}>
          {" "}
          <Flex gap={3} p={2}>
            <Box display={"flex"} flexDirection="column">
              <Text fontSize={".8rem"} fontWeight="bolder">
                Name/ID
              </Text>
              <Input />
            </Box>

            <Box flexDirection="column" display={["none", "flex"]}>
              <Text fontSize={".8rem"} fontWeight="bolder">
                Email
              </Text>
              <Input />
            </Box>
           
          </Flex>
          <Table variant="simple" >
            <Thead>
              <Th>Application Number</Th>
              <Th>Name</Th>
              <Th>email</Th>
              <Th>Age</Th>
              <Th>Amount</Th>

              <Th></Th>
            </Thead>
            <Tbody fontSize="sm">
              {applications
                .filter((each) => each.viewed === false)
                ?.map(
                  ({
                    firstName,
                    lastName,
                    dob,
                    emailAddress,
                    phoneNumber,
                    amount,
                    applicationRef,
                    residential,
                    nationalId,
                    id,
                  }) => {
                    return (
                      <Tr
                        key={nationalId}
                        rowGap={3}
                        _hover={{
                          shadow: "lg",
                          transition: "all 200ms ease-in-out",
                        }}
                      >
                        <Td>{applicationRef}</Td>
                        <Td display={"flex"} alignItems="center" gap={2}>
                          <Avatar size={"sm"} />
                          <Box>
                            <Text>
                              {firstName} {lastName}
                            </Text>
                            <Text color="gray.500" fontSize=".8rem">
                              {nationalId}
                            </Text>
                          </Box>
                        </Td>
                        <Td>
                          {" "}
                          <Box>
                            <Text>{emailAddress}</Text>
                            <Text color="gray.500" fontSize=".8rem">
                              {phoneNumber}
                            </Text>
                          </Box>
                        </Td>
                        <Td>
                          <Box>
                            <Text>
                              {new Date().getFullYear() -
                                parseInt(dob.split("-")[0])}
                            </Text>
                            <Text color="gray.500" fontSize=".8rem">
                              {dob}
                            </Text>
                          </Box>
                        </Td>
                        <Td>KES {amount}</Td>

                        <Td>
                          <Link
                            passHref
                            href={`/admin/chair/applications/${id}`}
                          >
                            <Button colorScheme="teal" size="sm">
                              view
                            </Button>
                          </Link>
                        </Td>
                      </Tr>
                    );
                  }
                )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </>
  );
};
export default Applications;
