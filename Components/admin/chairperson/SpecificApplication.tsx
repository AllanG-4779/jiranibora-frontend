import {
  Heading,
  Flex,
  Image,
  Box,
  Avatar,
  Text,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertTitle,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { db_application, sessionType } from "../../types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import AlertBox from "../../client/Signup/Alert";
import { getSession, useSession } from "next-auth/react";

const EachApplication = (props: any) => {
  {
    const application: db_application = props.application;

    const router = useRouter();
    const [loading, setLoading] = useState({
      loading: false,
      message: "",
      alertType: "",
    });

    const [alertSize, setAlertSize] = useState(-100);

    if (router.isFallback) {
      return <Spinner colorScheme="blue" />;
    }
    if (application === null) {
      return (
        <Alert colorScheme="red">Application with that ID was not found </Alert>
      );
    }

    const admissible =
      parseInt(application.amount) > 500 &&
      new Date().getFullYear() - parseInt(application.dob.split("-")[0]) > 18
        ? true
        : false;

    // take action on the application
    const action = async (act: string, id: string, reason?: string) => {
      const req: AxiosResponse | null = null;
      try {
        setLoading({ loading: true, message: "", alertType: "" });

        const session = (await getSession()) as sessionType;
        setLoading({ loading: false, message: "", alertType: "" });

        if (session.user.access_token) {
          setLoading({ loading: true, message: "", alertType: "" });

          const req = await axios.post(
            `${process.env.NEXT_PUBLIC_URL}/application/exec/${id}?action=${act}`,
            { reason },
            {
              headers: {
                Authorization: `Bearer ${session.user.access_token}`,
              },
            }
          );
          if (req.data) {
            setLoading({
              loading: false,
              message: "Action successful",
              alertType: "success",
            });

            setAlertSize(2);
            setTimeout(() => setAlertSize(-100), 10000);
          }
        } else {
          // if no session is found
          setLoading({
            message: "Authorization failed",
            loading: false,
            alertType: "error",
          });
          setAlertSize(2);
          setTimeout(() => setAlertSize(-100), 10000);
        }
      } catch (e: any) {
        console.log(e);
        setLoading({
          loading: false,
          message: e.toString().split(":")[1],
          alertType: "error",
        });

        setAlertSize(2);
       await  setTimeout(() => setAlertSize(-100), 10000);

       router.reload();


      
        
      }
    };
    return (
      <>
        <Flex bg="white" width={["100%", "90%"]} mx="auto" mt={5} p={3}>
          <Flex
            border={"1px"}
            borderColor="gray.200"
            p={2}
            width="100%"
            rounded="md"
            fontFamily={"Inter"}
            alignItems={["", "", "center"]}
            gap={3}
            direction={["column", "column", "row"]}
            justifyContent={["flex-start", "space-between"]}
          >
            <Flex gap={4} mx={[2, 2, 10]} alignItems="center">
              <Avatar size="sm" />
              <Flex direction={["column"]}>
                <Text color="green.500" fontWeight={"bold"}>
                  {application?.firstName} {application.lastName}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Monthly Contribution:{" "}
                  <Badge
                    rounded={"lg"}
                    minWidth="3rem"
                    textAlign={"center"}
                    colorScheme={
                      parseInt(application.amount) > 500 ? "green" : "red"
                    }
                  >
                    kes {application?.amount}
                  </Badge>
                </Text>
              </Flex>
            </Flex>
            <Flex fontSize={"sm"} direction="column" mx={[2, 2, 10]}>
              <Text>Applied: {application?.createdAt.split("T")[0]}</Text>
              <Text>
                <Badge colorScheme="green">ON-time</Badge>
              </Text>
            </Flex>
            <Flex
              fontSize={"sm"}
              direction={["row", "row", "column"]}
              mx={[2, 2, 10]}
              gap={3}
            >
              {application.viewed ? (
                <Text>
                  STATUS{" "}
                  <Badge
                    colorScheme={
                      application.status === "Declined"
                        ? "red"
                        : application.status === "Pending"
                        ? "blue"
                        : "green"
                    }
                    rounded="md"
                  >
                    {application.status}
                  </Badge>
                </Text>
              ) : (
                <>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => {
                      action("approve", application.applicationRef);
                      //router.reload();
                    }}
                  >
                    {loading.loading ? <Spinner /> : "Admit"}
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="orange"
                    onClick={() => {
                      const reason = prompt("Enter the reason for declining");
                      action("disapprove", application.applicationRef, reason!);
                      //router.reload();
                    }}
                  >
                    {loading.loading ? <Spinner /> : "Decline"}
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex
          bg="white"
          direction={"column"}
          width={["100%", "90%"]}
          mx="auto"
          mt={5}
          p={3}
        >
          <Text color="gray.500" textTransform={"uppercase"} mb={3}>
            Additional Information
          </Text>
          <Flex
            border="1px"
            borderColor="gray.200"
            p={4}
            gap={4}
            rounded="lg"
            direction={["column", "column", "row"]}
            justifyContent={["", "", "space-around"]}
          >
            <Flex direction="column" gap={3}>
              <Text>Contact details</Text>
              <Flex direction={"column"} fontSize="sm" gap={2}>
                <Flex
                  direction={["column", "row"]}
                  justifyContent={["", "space-between"]}
                  alignItems={"flex-start"}
                >
                  <Text color="gray.500">Email</Text>
                  <Text>{application?.emailAddress}</Text>
                </Flex>
                <Flex
                  minWidth={"20rem"}
                  justifyContent={["", "space-between"]}
                  alignItems={"flex-start"}
                  direction={["column", "row"]}
                >
                  <Text color="gray.500">National ID</Text>
                  <Text>{application?.nationalId}</Text>
                </Flex>
                <Flex
                  minWidth={"20rem"}
                  alignItems="flex-start"
                  justifyContent={["", "space-between"]}
                  direction={["column", "row"]}
                >
                  <Text color="gray.500">Residential Area</Text>
                  <Text>{application?.residential}</Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex direction="column" gap={3}>
              <Text>Official Information</Text>
              <Flex direction={"column"} fontSize="sm" gap={2}>
                <Flex
                  direction={["column", "row"]}
                  justifyContent={["", "space-between"]}
                  alignItems={"flex-start"}
                >
                  <Text color="gray.500">Application Number</Text>
                  <Text>{application?.applicationRef}</Text>
                </Flex>
                <Flex
                  minWidth={"20rem"}
                  justifyContent={["", "space-between"]}
                  alignItems={"flex-start"}
                  direction={["column", "row"]}
                >
                  <Text color="gray.500">Admissible</Text>
                  {/* if the age and the amount limit is not met addmissible flag is false */}
                  <Badge colorScheme={admissible ? "green" : "red"}>
                    {admissible ? "Yes" : "No"}
                  </Badge>
                </Flex>
                {admissible ? (
                  ""
                ) : (
                  <Flex
                    minWidth={"20rem"}
                    alignItems="flex-start"
                    justifyContent={["", "space-between"]}
                    direction={["column", "row"]}
                  >
                    <Text color="gray.500">Reason</Text>
                    <Badge colorScheme="red">
                      {parseInt(application.amount) < 500 ? "Amount" : "Age"}{" "}
                      limit not met
                    </Badge>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <AlertBox
          size={alertSize}
          message={loading.message}
          type={loading.alertType}
          setSize={setAlertSize}
        />
      </>
    );
  }
};
export default EachApplication;
