import {
  Box,
  VStack,
  Text,
  Spinner,
  Heading,
  Flex,
  Button,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormLabel,
  FormControl,
  Input,
  FormErrorMessage,
  Alert,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import MemberLayout from "../../Components/client/member/MemberLayout";
import { sessionType } from "../../Components/types";
import { getSession } from "next-auth/react";
import { clientPost } from "../../Commons";

const Profile = () => {
  const [member, setMember] = useState<sessionType | null>(null);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [valid, setValid] = useState({ message: "", valid: false });
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState("");
  const [loading, setLoading]= useState(false)
  const [password, setPassword] = useState({
    prev: "",
    current: "",
    confirm: "",
  });
  const updatePassword = async (data: {
    newPassword: string;
    oldPassword: string;
  }) => {
    setLoading(true)
    const req = await clientPost({
      token: member?.user.access_token,
      method: "PATCH",
      data: data,
      url: "password/change",
    });
    if (req > 300) {
      setPasswordUpdateMessage("Your old password is wrong");
    } else if (req < 300) {
      setPasswordUpdateMessage("Password updated successfully");
    }
    setLoading(false)
  };
  useEffect(() => {
    const getToken = async () => {
      const session = (await getSession()) as sessionType;
      if (session) {
        setMember(session);
      }
    };
    getToken();
  }, []);
  return (
    <Box width={"100%"} height="100%">
      {member == null ? (
        <Spinner />
      ) : (
        <Box>
          <Heading fontSize={"1.3rem"}>Your Profile</Heading>
          <Flex mt={10} gap={5} width="80%" mx="auto" direction="column">
            <Flex direction="column">
              <Text fontWeight="bolder">Names</Text>
              <Text fontSize="1.1rem">{member!.user.fullName}</Text>
            </Flex>
            <Flex direction="column">
              <Text fontWeight={"bolder"}>Jirani Bora ID</Text>
              <Text fontSize="1.1rem">{member!.user.memberId}</Text>
            </Flex>
            <Flex direction="column">
              <Text fontWeight={"bolder"}>Contact Information</Text>
              <Text fontSize="1.1rem">+254{member!.user.phone}</Text>
            </Flex>{" "}
            <Flex direction="column">
              <Text fontWeight={"bolder"}>Monthly Contribution Amount</Text>
              <Text fontSize="1.1rem">KES {member!.user.monthlyCont}</Text>
            </Flex>
            <Button
              colorScheme="blue"
              fontWeight="light"
              size="sm"
              onClick={onOpen}
            >
              Change Passoword
            </Button>
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                p={2}
                bg="primary.900"
                fontWeight={"light"}
                color="white"
              >
                Change Password
              </ModalHeader>
              <ModalCloseButton color={"white"} />
              <ModalBody>
                <FormControl>
                  <FormLabel>Current Password</FormLabel>
                  <Input
                    size="md"
                    type="password"
                    value={password.prev}
                    onChange={(e) =>
                      setPassword({ ...password, prev: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl
                  isInvalid={
                    !valid.valid &&
                    valid.message.length > 0 &&
                    valid.message.startsWith("Minimum")
                  }
                >
                  <FormLabel>New Password</FormLabel>
                  <Input
                    onChange={(e) => {
                      if (e.target.value.length < 6) {
                        setValid({
                          valid: false,
                          message: "Minimum length required is 6 characters",
                        });
                      } else {
                        setValid({ valid: true, message: "" });
                      }
                      setPassword({ ...password, current: e.target.value });
                    }}
                    size="md"
                    type="password"
                  />
                  <FormErrorMessage>{valid.message}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    !valid.valid &&
                    valid.message.length > 0 &&
                    valid.message.startsWith("Passwords")
                  }
                >
                  <FormLabel>Enter Current Password</FormLabel>
                  <Input
                    size="md"
                    type="password"
                    onChange={(e) => {
                      if (e.target.value !== password.current) {
                        setValid({
                          valid: false,
                          message: "Passwords do not match",
                        });
                      } else {
                        setValid({ valid: true, message: "" });
                      }
                      setPassword({ ...password, confirm: e.target.value });
                    }}
                  />
                  <FormErrorMessage>{valid.message}</FormErrorMessage>
                </FormControl>
                {passwordUpdateMessage.length > 0 ? (
                  <Alert
                    colorScheme={
                      passwordUpdateMessage.startsWith("Your") ? "red" : "green"
                    }
                  >
                    {passwordUpdateMessage}
                  </Alert>
                ) : (
                  <Text></Text>
                )}
              </ModalBody>
              <ModalFooter gap={3}>
                <Button
                  colorScheme={"blue"}
                  size="sm"
                  disabled={!valid.valid}
                  onClick={() => {
                    updatePassword({
                      newPassword: password.current,
                      oldPassword: password.prev,
                    });
                  }}
                >
                  {!loading?"Update":<Spinner/>}
                </Button>

                <Button variant={"ghost"} colorScheme={"red"} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Box>
  );
};

Profile.PageLayout = MemberLayout;
export default Profile;
