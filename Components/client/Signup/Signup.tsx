import { Box, Button, Flex, VStack, Text, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import Header from "../../Navigation";
import { errors, SignupData, steps } from "./Utils";
import { FaCheck } from "react-icons/fa";
import AlertBox from "./Alert";
import axios from "axios";

// errors

const Signup = () => {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(-100);
  const [fetchState, setFetch] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [formErrors, setErrors] = useState<errors>({
    error: true,
    message: "",
  });

  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    amount: "",
    emailAddress: "",
    phoneNumber: "",
    residential: "",
    nationalId: "",
    dob: "",
  });
  const checkIfEmpty = (param: Array<string | undefined>) => {
    const final = param.reduce((prev, next) => {
      return prev || next?.length == 0;
    }, false);
    return final;
  };
  // check navigation:
  const shouldItMoveToNextComponent = ({
    firstName,
    lastName,
    amount,
    emailAddress,
    phoneNumber,
    residential,
    nationalId,
    dob,
  } = signupData) => {
    if (active == 0) {
      return (
        checkIfEmpty([firstName, lastName, phoneNumber, emailAddress]) ||
        formErrors.error
      );
    }
    if (active === 1) {
      return checkIfEmpty([amount]) || formErrors.error;
    }
    if (active === 2) {
      return checkIfEmpty([residential, nationalId, dob]) || formErrors.error;
    }
  };
  //  if the details are duely filled then, onsubmit  pop up should come out
  const handleSubmit = async () => {
    // submit the data passed
    setFetch({ ...fetchState, loading: true });

    try {
      console.log(process.env.BACKEND_URL);
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/application/apply`,
        signupData
      );

      if (result.status == 201) {
        setFetch({
          loading: false,
          error: "",
          success:
            "Submitted successfully, We'll review your application and get back to you! Thank you.",
        });
        setSize(2);
      }
    } catch (e: any) {
      if (e.response.status == 500) {
        setFetch({
          loading: false,
          success: "",
          error: "Some or all of your inputs were rejected by the server",
        });
        setSize(2);
      } else if (e.response.status == 611) {
        setFetch({
          success: "",
          loading: false,
          error: e.response.data.message,
        });
        setSize(2);
      } else if (e.response.status === 403) {
        setFetch({
          success: "",
          loading: false,
          error: "Application is currently closed ",
        });
        setSize(2);
      } else {
        setFetch({
          success: "",
          loading: false,
          error: "Check your conection and try again.",
        });
        setSize(2);
      }
    } finally {
      setTimeout(() => setSize(-100), 10000);
    }
  };

  const CurrentComponent = steps[active];

  return (
    <VStack
      width={["100vw"]}
      h="100vh"
      m="auto"
      bg={["#f2f2f2"]}
      p={1}
      justify="center"
      alignItems={"center"}
      overflow="hidden"
    >
      <VStack
        w={["95%", "60%", "50%", "32%"]}
        bg="white"
        p={3}
        shadow="lg"
        rounded="lg"
      >
        {" "}
        <Header />
        {active < 3 ? (
          <Flex width={"100%"} gap={2} p={3}>
            <Box
              bg={active > 0 ? "green.300" : "gray.300"}
              w="30%"
              h="4px"
            ></Box>
            <Box
              bg={active > 1 ? "green.300" : "gray.300"}
              w="30%"
              h="4px"
            ></Box>
            <Box
              bg={active > 2 ? "green.300" : "gray.300"}
              w="30%"
              h="4px"
            ></Box>
          </Flex>
        ) : (
          <Box
            bg="green.100"
            p={3}
            borderRadius="50%"
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
            justifyContent="center"
          >
            <FaCheck color={"green"} />
          </Box>
        )}
        <Box as="div" width={["100%"]} mx="auto" px={5}>
          <Text fontWeight="bold" color="primary.800">
            {CurrentComponent.name}
          </Text>

          <CurrentComponent.component
            userdata={signupData!}
            updater={setSignupData}
            updateError={setErrors}
            formerrors={formErrors}
            active={active}
            updateActive={setActive}
            moveToNext={() => shouldItMoveToNextComponent(signupData)}
          />
        </Box>
        {active < steps.length - 1 ? (
          <></>
        ) : (
          <Flex
            gap={6}
            alignItems="center"
            align={"center"}
            flexDir="row-reverse"
          >
            <Button
              size={"sm"}
              bg="green.400"
              color="white"
              _hover={{
                bg: "green.400",
              }}
              onClick={handleSubmit}
            >
              {fetchState.loading ? <Spinner /> : "Yes, submit"}
            </Button>
            <Text
              as="button"
              color="red.500"
              fontWeight="bold"
              fontSize={"15px"}
              onClick={() => setActive((prev) => prev - 1)}
            >
              Edit
            </Text>

            <AlertBox
              type={fetchState.success.length > 0 ? "success" : "error"}
              setSize={setSize}
              message={
                fetchState.error.length > 0
                  ? fetchState.error
                  : fetchState.success
              }
              size={size}
            />
          </Flex>
        )}
        {/* <OTPModal
          open={isOpen}
          caution=" By pressing the verify button you affirm that you are the primary
          owner of the phone number you provided."
          heading="Confirm Phone number"
          action={`Enter the 6-digit code sent to +2547${signupData.phone?.substring(
            1,
            3
          )}xxx${signupData.phone?.substring(7, 9)} via SMS`}
          toggle={setOpen}
        /> */}
      </VStack>
    </VStack>
  );
};

export default Signup;
