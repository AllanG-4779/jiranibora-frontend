import {
  Button,
  Flex,
  Table,
  TableContainer,
  Th,
  Td,
  Text,
  Thead,
  Box,
  Tr,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormControl,
  ModalFooter,
  FormLabel,
  useDisclosure,
  Input,
  Alert,
  Spinner,
  Tbody,
} from "@chakra-ui/react";
import { ContactSupportRounded, Download } from "@mui/icons-material";
import moment from "moment";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import {
  checkAuthStatusAndReturnToken,
  clientPost,
  dateDescription,
  fetchData,
  formatNumber,
  getTimeDetails,
} from "../../../Commons";
import { activeContribution, contributionSummary } from "../../types";
import CountDown from "../chairperson/CountDown";

const ContributionComponent = () => {
  const [duration, setDuration] = useState(1);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [activeCont, setActiveCont] = useState<activeContribution | null>(null);
  const router = useRouter();
  const [closedContribution, setClosedContribution] =
    useState<contributionSummary>([]);
  const [countContribution, setCount] = useState(0);
  const [authToken, setToken] = useState("");

  // if cont is not null?
  const total =
    activeCont !== null && typeof activeCont !== "undefined"
      ? ((new Date(activeCont.closeOn).getTime() +
          3 * 60 *60 * 1000) -
          new Date().getTime()) /
        1000
      : 0;
  console.log("The total is ", total);

  const openContribution = async (duration: number, token: string) => {
    const result = await clientPost({
      url: `cont/new?duration=${duration}`,
      method: "POST",
      token,
    });
    if (result == 200) {
      // Notify the user
      console.log("Success");
    } else {
      console.log("Error");
    }
  };
  useEffect(() => {
    const findActiveMonth = async (token: string) => {
      const authToken = await checkAuthStatusAndReturnToken(router, "TRE");
      authToken ? setToken(authToken) : setToken("");
      const result = await fetchData({
        url: "cont/active",
        token,
      });

      if (result) {
        console.log(result);
        return result;
      }
      if (typeof result == "number") {
        throw new Error("Something went wrong");
      }
    };
    const findNumberOfMonths = async (token: string) => {
      const numberOfMeetings = await fetchData({ url: "cont/howmany", token });
      if (numberOfMeetings) {
        return numberOfMeetings;
      } else {
        throw new Error("Could not retrieve data");
      }
    };
    const findAllContributionsClosed = async (token: string) => {
      const allContributions = (await fetchData({
        url: "cont/jb/all",
        token,
      })) as contributionSummary;
      if (allContributions) {
        return allContributions;
      } else {
        throw new Error("Something went wrong");
      }
    };

    findAllContributionsClosed(authToken)
      .then((each) => setClosedContribution(each))
      .catch((error) => console.log(error));

    findActiveMonth(authToken)
      .then((cont) => {
        console.log(cont);
        setActiveCont(cont);
        setCount(cont?.numberOfMeetings);
      })
      .catch((error) => console.log(error));

    findNumberOfMonths(authToken)
      .then((success) => setCount(success))
      .catch((err) => console.log(err));
    console.log(activeCont);
  }, [authToken]);

  return (
    <>
      <Flex width="100%">
        <Flex
          direction="column"
          bg="white"
          p={10}
          width="100%"
          rounded="md"
          position="relative"
        >
          <Flex justifyContent={"space-between"}>
            {typeof activeCont !== "undefined" && activeCont !== null ? (
              <Box>
                <CountDown
                  title={`Contribution for ${activeCont.month} is ON and closes in`}
                  seconds={total}
                  endMessage={"Time is up Contribution is closed"}
                />
              </Box>
            ) : countContribution == 12 ? (
              <Alert colorScheme="red" color="red.600" mt={10}>
                You cannot open any more contribution because last contribution
                for the year has been reached
              </Alert>
            ) : (
              <Button
                size={["sm"]}
                colorScheme="twitter"
                maxWidth="10rem"
                mb={4}
                onClick={onOpen}
              >
                Open Contribution
              </Button>
            )}
          </Flex>
          <Text color="gray" fontSize="sm" mt={10}>
            Previous Contributions
          </Text>
          <TableContainer p={4}>
            {closedContribution.length <= 0 ? (
              <Spinner speed=".8s" />
            ) : (
              <Table
                size="sm"
                variant="unstyled"
                colorScheme="blue"
                p={5}
                style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Open</Th>
                    <Th>Close</Th>
                    <Th>Locked Members</Th>
                    <Th>Collections </Th>
                    <Th>Expected Penalties</Th>
                  </Tr>
                </Thead>
                <Tbody p={4}>
                  {closedContribution.map((each) => {
                    return (
                      <Tr key={each.contributionId}>
                        <Td>{each.contributionId}</Td>
                        <Td>
                          {dateDescription(getTimeDetails(each.openDate).date)}
                          {"  "}
                          {getTimeDetails(each.openDate).time}
                        </Td>
                        <Td>
                          {dateDescription(getTimeDetails(each.closeDate).date)}
                          {"  "}
                          {getTimeDetails(each.closeDate).time}
                        </Td>
                        <Td isNumeric>{each.lockedMembers}</Td>
                        <Td isNumeric>
                          KES {formatNumber(each.amountCollected)}
                        </Td>
                        <Td isNumeric>
                          KES {formatNumber(each.expectedPenalties)}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </TableContainer>
        </Flex>
        <Modal onClose={onClose} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="twitter.600">Set Duration</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Enter Amount</FormLabel>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter gap={7}>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>{" "}
              <Button
                size="sm"
                colorScheme="blue"
                onClick={async () => {
                  await openContribution(duration, authToken);
                  onClose();
                  router.reload();
                }}
              >
                Open
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};
export default ContributionComponent;
