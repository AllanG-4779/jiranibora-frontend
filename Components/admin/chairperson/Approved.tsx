import {
  Text,
  Flex,
  TableContainer,
  Th,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Box,
  Input,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  Button,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { clientPost, fetchData } from "../../../Commons";
import { db_application, sessionType } from "../../types";
const Approved = (props: any) => {
  let approved: Array<db_application> = props.approved;
  const [search, setSearch] = useState("");
  const [parameter, setParameter] = useState({
    name: "",
    value: "",
    memberId: "",
  });

  if (approved.length === 0 && !props.success) {
    return <Box>Data was not successfully fetched</Box>;
  }
  const filterValues = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <>
      <Flex width={["100%"]} mx="auto" direction="column" p={3}>
        <Text mb={4} fontSize="1.5rem">
          Members
        </Text>

        <TableContainer bg="white" p={4} rounded={"md"}>
          <Input
            placeholder="Filter by anything"
            onChange={(e) => filterValues(e)}
            fontSize={"sm"}
            value={search}
          />
          <Table>
            <Thead>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Residence</Th>
              <Th>Amount</Th>
              <Th>Date Joined</Th>
            </Thead>
            <Tbody fontSize="sm">
              {approved
                .filter(
                  (app) =>
                    app.amount.includes(search) ||
                    app.lastName.includes(search) ||
                    app.phoneNumber.includes(search) ||
                    app.firstName.includes(search) ||
                    app.emailAddress.includes(search) ||
                    app.residential.includes(search) ||
                    app.nationalId.includes(search) ||
                    app.applicationRef.includes(search)
                )
                .map((each: db_application) => {
                  return (
                    <Tr key={each.applicationRef}>
                      <Td>{each.applicationRef}</Td>
                      <Td
                        onDoubleClick={() => {
                          setParameter({
                            name: "name",
                            value: each.firstName + " " + each.lastName,
                            memberId: each.applicationRef,
                          });
                          onOpen();
                        }}
                      >
                        {each.firstName} {each.lastName}
                      </Td>
                      <Td
                        onDoubleClick={() => {
                          setParameter({
                            name: "phoneNumber",
                            value: each.phoneNumber,
                            memberId: each.applicationRef,
                          });
                          onOpen();
                        }}
                      >
                        {each.phoneNumber}
                      </Td>
                      <Td
                        onDoubleClick={() => {
                          setParameter({
                            name: "emailAddress",
                            value: each.emailAddress,
                            memberId: each.applicationRef,
                          });
                          onOpen();
                        }}
                      >
                        {each.emailAddress}
                      </Td>
                      <Td
                        onDoubleClick={() => {
                          setParameter({
                            name: "residential",
                            value: each.residential,
                            memberId: each.applicationRef,
                          });
                          onOpen();
                        }}
                      >
                        {each.residential}
                      </Td>
                      <Td>{each.amount}</Td>
                      <Td>{each.actedUponAt.split("T")[0]}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={"sm"}>Update {parameter.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                value={parameter.value}
                onChange={(e) =>
                  setParameter({ ...parameter, value: e.target.value })
                }
              />
            </ModalBody>

            <ModalFooter>
              <Button size="sm" colorScheme="red" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="blue"
                onClick={async () => {
                  const session = (await getSession()) as sessionType;
                  const res = await clientPost({
                    token: session.user.access_token,
                    method: "PATCH",
                    url: "application/update",
                    data: {
                      param: parameter.name,
                      memberId: parameter.memberId,
                      value: parameter.value,
                    },
                  });
                  onClose();
                }}
              >
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};
export default Approved;
