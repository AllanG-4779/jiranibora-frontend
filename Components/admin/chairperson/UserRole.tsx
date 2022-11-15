import {
  Flex,
  Text,
  Box,
  Heading,
  Button,
  Badge,
  Spinner,
  Alert,
} from "@chakra-ui/react";
import { getSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { clientPost, fetchData } from "../../../Commons";
import { sessionType, users } from "../../types";

const UserRole = () => {
  const [activePersons, setActivePersons] = useState<users>([]);
  const [memberRole, setMemberRole] = useState({ memberId: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [memberActivate, setActivation] = useState({
    memberId: "",
    action: "",
  });
  const activateDeactivateUser = async () => {
    setLoading(true);
    const session = (await getSession()) as sessionType;
    const post_data = await clientPost({
      url: `update/status/${memberActivate.action}?user=${memberActivate.memberId}`,
      method: "PATCH",
      token: session.user.access_token,
    });
    if (post_data) {
      setLoading(false);
      setMessage(`User ${memberActivate.action}d successfully`);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };
  const updateRole = async () => {
    setLoading(true);
    const session = (await getSession()) as sessionType;
    const post_data = await clientPost({
      url: `update/role`,
      method: "PATCH",
      token: session.user.access_token,
      data: memberRole,
    });
    if (post_data) {
      setLoading(false);
      setMessage(
        `Member ${memberRole.memberId} was set as the new ${memberRole.role} successfully`
      );
      setTimeout(() => {
        setMessage("");
      }, 5000);

      if (memberRole.role === "CHAIR") {
        setMessage(
          "Chairperson role changed, you will be logged out in 5 seconds"
        );
        setTimeout(() => signOut({ callbackUrl: "/login" }), 10000);
      }
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const session = (await getSession()) as sessionType;
      if (session) {
        const activeUsers = (await fetchData({
          token: session.user.access_token,
          url: "members",
          method: "GET",
        })) as users;
        if (activeUsers) {
          console.log("Users", activeUsers);
          setActivePersons(activeUsers);
        }
      }
    };
    fetchUsers();
  }, [loading]);
  return (
    <Flex direction="column">
      <Heading fontSize="1.2rem" fontWeight="normal" ml={6} width="100%">
        Control what is done by the Officials and Users
      </Heading>

      <Flex direction="column" mt={5} width={["98%", "90%", "80%"]} mx="auto">
        <Text mb={5} fontWeight="bolder">
          Current Users
        </Text>
        <Flex
          direction={"row"}
          gap={4}
          width="100%"
          justifyContent={"space-around"}
        >
          {" "}
          <Box bg="white" p={3} rounded="md" shadow="sm" width="25%">
            <Text fontWeight="normal">Registered Users</Text>
            <Text fontSize={"3xl"}>{activePersons.length}</Text>
          </Box>
          {typeof activePersons !== "undefined" ? (
            <>
              {" "}
              <Box bg="white" p={3} rounded="md" shadow="sm" width="25%">
                <Text>Chairperson</Text>
                <Text fontWeight="bold" fontSize="xl" color="blackAlpha.80">
                  {
                    activePersons
                      .filter((each) => each.role.includes("CHAIR"))[0]
                      ?.fullName.split("ID")[0]
                  }{" "}
                </Text>
                <Text fontSize=".8rem" color="gray.400">
                  Since 14th Jan
                </Text>
              </Box>
              <Box bg="white" p={3} rounded="md" shadow="sm" width="25%">
                <Text>Secretary</Text>
                <Text fontWeight="bold" fontSize="xl" color="blackAlpha.800">
                  {
                    activePersons
                      .filter((each) => each.role.includes("SEC"))[0]
                      ?.fullName.split("ID")[0]
                  }{" "}
                </Text>
                <Text fontSize=".8rem" color="gray.400">
                  Since 14th Jan
                </Text>
              </Box>
              <Box bg="white" p={3} rounded="md" shadow="sm" width="25%">
                <Text>Treasurer</Text>
                <Text fontWeight="bold" fontSize="xl" color="blackAlpha.800">
                  {
                    activePersons
                      .filter((each) => each.role.includes("TRE"))[0]
                      ?.fullName.split("ID")[0]
                  }{" "}
                </Text>
                <Text fontSize=".8rem" color="gray.400">
                  Since 14th Jan
                </Text>
              </Box>
            </>
          ) : (
            "Loading"
          )}
        </Flex>
        <Flex gap={5} width="100%">
          <Flex mt={10} direction="column" width="100%" gap={5}>
            <Box width="70%">
              <Text mb={5}>Change User roles</Text>

              <Select
                placeholder="Select User"
                onChange={(option) =>
                  setMemberRole({ ...memberRole, memberId: option!.value })
                }
                options={
                  activePersons !== null && typeof activePersons !== "undefined"
                    ? activePersons
                        .filter(
                          (record) => record.role === "USER" && record.status
                        )
                        .map((each) => {
                          return {
                            value: each.memberId,
                            label: `${each.fullName.split("ID")[0]}-${
                              each.memberId
                            }
                        `,
                          };
                        })
                    : []
                }
              />
            </Box>
            <Box width="70%">
              <Select
                placeholder="Select Role"
                onChange={(option) =>
                  setMemberRole({ ...memberRole, role: option!.value })
                }
                options={[
                  { value: "SEC", label: "Secretary" },
                  { value: "CHAIR", label: "Chairperson" },
                  { value: "TRE", label: "Treasurer" },
                ]}
              />
            </Box>
            <Box>
              <Button
                disabled={
                  memberRole.memberId.length < 1 || memberRole.role.length < 1
                }
                colorScheme="green"
                size="sm"
                onClick={updateRole}
              >
                {loading ? <Spinner /> : "Change Role"}
              </Button>
            </Box>
            <Alert
              display={
                message.length > 1 && message.startsWith("Member")
                  ? "flex"
                  : "none"
              }
              colorScheme={"red"}
            >
              {message}
            </Alert>
          </Flex>{" "}
          <Flex mt={10} direction="column" gap={5} width="100%">
            <Box width="70%">
              <Text mb={5}>Activate/Deactivate User</Text>

              <Select
                placeholder="Select User"
                onChange={(option) =>
                  setActivation({ ...memberActivate, memberId: option!.value })
                }
                options={
                  activePersons !== null && typeof activePersons !== "undefined"
                    ? activePersons
                        .filter((each) => {
                          if (memberActivate.action === "activate")
                            return each.status === false;
                          if (memberActivate.action === "deactivate")
                            return each.status === true;
                        })
                        .map((each) => {
                          return {
                            value: each.memberId,
                            label: `${each.fullName.split("ID")[0]}-${
                              each.memberId
                            }
                        `,
                          };
                        })
                    : []
                }
              />
            </Box>
            <Box width="70%">
              <Select
                placeholder="Select Role"
                onChange={(option) =>
                  setActivation({ ...memberActivate, action: option!.value })
                }
                options={[
                  { value: "activate", label: "Activate" },
                  { value: "deactivate", label: "Deactivate" },
                ]}
              />
            </Box>
            <Box>
              <Button
                disabled={
                  memberActivate.memberId.length < 1 ||
                  memberActivate.action.length < 1
                }
                colorScheme={
                  memberActivate.action === "activate" ? "green" : "red"
                }
                size="sm"
                onClick={async () => await activateDeactivateUser()}
              >
                {loading ? <Spinner /> : "Execute"}
              </Button>
            </Box>
            <Alert
              display={
                message.length > 1 && message.startsWith("User")
                  ? "flex"
                  : "none"
              }
              colorScheme={"green"}
            >
              {message}
            </Alert>
            <Alert
              justifySelf={"center"}
              display={
                message.length > 1 && message.startsWith("Chairperson")
                  ? "flex"
                  : "none"
              }
              colorScheme={"red"}
            >
              {message}
            </Alert>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserRole;
