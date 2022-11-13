import {
  Alert,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Dangerous, Warning } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  checkAuthStatusAndReturnToken,
  fetchData,
  formatNumber,
} from "../../../Commons";
import { memberEarning } from "../../types";
import { useRouter } from "next/router";

const MembersComponent = () => {
  const [memberEarning, setMemberEarning] = useState<memberEarning>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchProvisionalEarning = async () => {
      const provisionalResult = await fetchData({
        url: "admin/treasurer/earning",
        token: await checkAuthStatusAndReturnToken(router, "TRE"),
      });
      if (provisionalResult) {
        return setMemberEarning(provisionalResult);
      } else {
        throw new Error("Something went wrong");
      }
    };
    fetchProvisionalEarning();
  }, []);

  return (
    <>
      <Flex width="100%">
        <Flex direction={"column"} bg="white" width="100%" p={4} rounded="md">
          <Text fontWeight="bold" fontFamily="Arial" opacity={0.9}>
            Provisional Member Earning
          </Text>
          <Alert
            bg="red.50"
            color="red.400"
            mt={10}
            justifyContent={"space-between"}
            rounded="md"
            mb={5}
            size="xs"
          >
            <Text fontWeight={"light"} fontSize="sm">
              This data is based on the current records of transactions. It
              therefore subject to change.
            </Text>
            <Warning />
          </Alert>
          <TableContainer padding={3}>
            {memberEarning.length >= 1 ? (
              <Table size="lg">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Member Id</Th>
                    <Th>Total Contribution</Th>
                    <Th>Outstanding Loans</Th>
                    <Th>Fines</Th>
                    <Th>Penalties</Th>
                    <Th>Net Contributions</Th>
                    <Th>Net Shares</Th>
                    <Th>Interest Earned</Th>
                    <Th>final payout</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {memberEarning.map((each) => {
                    return (
                      <Tr key={each.memberId}>
                        <Td>{each.name}</Td>
                        <Td>{each.memberId}</Td>
                        <Td>
                          KES{" "}
                          {formatNumber(
                            parseFloat(each.totalContribution.toFixed(2))
                          )}
                        </Td>
                        <Td>
                          KES {formatNumber(parseFloat(each.loans.toFixed(2)))}
                        </Td>
                        <Td>
                          KES {formatNumber(parseFloat(each.fines.toFixed(2)))}
                        </Td>
                        <Td>
                          KES{" "}
                          {formatNumber(parseFloat(each.penalties.toFixed(2)))}
                        </Td>
                        <Td>
                          KES{" "}
                          {formatNumber(
                            parseFloat(each.netContribution.toFixed(2))
                          )}
                        </Td>
                        <Td>KES {formatNumber(each.netShares)}</Td>
                        <Td>KES {formatNumber(each.interestEarned)}</Td>
                        <Td>{formatNumber(each.finalPayout)}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            ) : (
              <Spinner />
            )}
          </TableContainer>
        </Flex>
      </Flex>
    </>
  );
};

export default MembersComponent;
