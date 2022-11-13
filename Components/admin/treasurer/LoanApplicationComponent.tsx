import {
  Alert,
  Box,
  Button,
  Flex,
  Text,
  Modal,
  Spinner,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { Approval, Cancel, Check, Repeat } from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCross } from "react-icons/fa";
import { RiChatFollowUpFill } from "react-icons/ri";
import {checkAuthStatusAndReturnToken, clientPost, fetchData, formatNumber} from "../../../Commons";
import { loanApplicationDetail, sessionType } from "../../types";

const LoanApplicationComponent = () => {
  const router = useRouter();
  const [specificApplication, setApplication] =
    useState<loanApplicationDetail | null>(null);
  const [action, setAction] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loader, setLoader] = useState(true);
  const [authToken, setToken] = useState("")
  useEffect(() => {

    const fetchDetail = async (token:string) => {
      const sessionToken = await  getSession()as sessionType
      setToken(sessionToken.user.access_token?sessionToken.user.access_token:"")
      const applicationDetail = (await fetchData({
        url: "loan/all/pending",
        token
      })) as loanApplicationDetail[];
      if (applicationDetail) {
        return applicationDetail.filter(
          (each) => each.loanId == router.query.id
        )[0];
      }
    };
    setTimeout(() => setLoader(false), 10000);
    fetchDetail(authToken)
      .then((success) => setApplication(success!))
      .catch((e) => console.log(e));
  }, [authToken]);
  const takeActionOnLoan = async (loanAction: string, token:string) => {
    const loanApproval = await clientPost({
      url: `loan/take/action/${specificApplication?.loanId}?action=${loanAction}`,
      method: "POST",
      token
    });
    if (loanApproval < 300) {
      // Successful
      console.log("Success");
    } else {
      // Failed
      console.log("Failed");
    }
  };

  return (
    <>
      <Flex
        direction="column"
        position="relative"
        width={["95%", "90%", "70%", "65%"]}
        mx="auto"
        bg="white"
        p={10}
        rounded="md"
        gap={3}
      >
        {specificApplication !== null &&
        typeof specificApplication !== "undefined" ? (
          <>
            {" "}
            <Flex
              shadow="sm"
              justifyContent="space-between"
              direction={["column", "column", "column", "row"]}
            >
              <Flex direction="column" gap={4}>
                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Member ID</Text>
                  <Text fontSize={".9rem"} color="gray">
                    {specificApplication?.memberId}
                  </Text>
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Full Name</Text>
                  <Text fontSize={".9rem"} color="gray">
                    {specificApplication?.fullName}
                  </Text>
                </Flex>

                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Total Savings</Text>
                  <Text fontSize={".9rem"} color="gray">
                    KES {formatNumber(specificApplication?.contribution!)}
                  </Text>
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Loan Application ID</Text>
                  <Text fontSize={".9rem"} color="gray">
                    {specificApplication.loanId}
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="column" gap={4}>
                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Amount Applied for</Text>
                  <Text fontSize={".9rem"} color="gray">
                    KES {formatNumber(specificApplication?.amount)}
                  </Text>
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Duration for payment</Text>
                  <Text fontSize={".9rem"} color="gray">
                    2 months
                  </Text>
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Ownership</Text>
                  <Text fontSize={".9rem"} color="gray">
                    Self
                  </Text>
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  direction={["column", "row", "row", "column"]}
                >
                  <Text>Outstanding Loan</Text>
                  <Text fontSize={".9rem"} color="gray">
                    No
                  </Text>
                </Flex>
              </Flex>
            </Flex>{" "}
            <Flex gap={[2, 2, 4, 8]} justifyContent="center" mt={[4]}>
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                color="twitter.500"
                border="1px solid transparent"
                p={3}
                rounded="md"
                textAlign="center"
                borderColor={"twitter.200"}
                transition="all 200ms ease-in-out"
                _hover={{
                  color: "white",
                  bg: "twitter.500",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onOpen();
                  setAction("approve");
                }}
              >
                <Check />
                <Text>Approve</Text>
              </Box>
              <Box
                display="flex"
                flex={1}
                color="twitter.500"
                border="1px solid transparent"
                p={3}
                flexDirection="column"
                rounded="md"
                justifyContent="center"
                alignItems={"center"}
                borderColor={"twitter.200"}
                transition="all 200ms ease-in-out"
                _hover={{
                  color: "white",
                  bg: "twitter.500",
                  cursor: "pointer",
                  borderColor: "transparent",
                }}
                onClick={() => {
                  onOpen();
                  setAction("disapprove");
                }}
              >
                <Cancel />
                <Text>Reject</Text>
              </Box>
            </Flex>
          </>
        ) : (
          <Flex w="100%" h={"100%"} mx="auto">
            {loader ? (
              <Spinner />
            ) : (
              <Alert>No application with that ID was found</Alert>
            )}
          </Flex>
        )}
        <Modal onClose={onClose} isOpen={isOpen}>
          {" "}
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="white" bg={"twitter.500"}>
              Confirm Loan {action.startsWith("app") ? "Approval" : "Rejection"}
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <Text>
                The action will take effect on loan with ID{" "}
                <span style={{ fontWeight: "bolder" }}>
                  {specificApplication?.loanId}{" "}
                </span>
              </Text>
            </ModalBody>
            <ModalFooter gap={5}>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="twitter"
                onClick={async () => {
                  await takeActionOnLoan(action, authToken);
                  onClose();
                }}
              >
                Proceed
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};
export default LoanApplicationComponent;
