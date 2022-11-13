import { Flex, Text, Box, Spinner, Button } from "@chakra-ui/react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { FaAdjust, FaDownload } from "react-icons/fa";
import { MdMoneyOff } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { SiProcessingfoundation } from "react-icons/si";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import {
  performanceData,
  performanceDto,
  sessionType,
  treasurerHomePageType,
} from "../../types";
import { useRouter } from "next/router";

import {
  checkAuthStatusAndReturnToken,
  fetchData,
  formatNumber,
} from "../../../Commons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TresurerReport from "../../reports/TresurerReport";
import { getSession } from "next-auth/react";

const TreasurerDashboard = () => {
  const router = useRouter();
  const [homePageData, setHomepageData] =
    useState<treasurerHomePageType | null>(null);
  const [treasurerReport, setTreasurerReport] =
    useState<performanceData | null>(null);
    
  useEffect(() => {
    const fetchHomePage = async () => {
      const session = (await getSession()) as sessionType;
      const result = await fetchData({
        method: "POST",
        url: "admin/treasurer/home",
        token: await checkAuthStatusAndReturnToken(router, "TRE"),
      });
      // fetch report data
      const reportData: performanceDto = await fetchData({
        method: "GET",
        url: "admin/treasurer/report",
        token: await checkAuthStatusAndReturnToken(router, "TRE"),
      });

      if (
        typeof result !== ("undefined" || "number") &&
        typeof reportData !== "undefined"
      ) {
        let members = {
          members: {
            active: reportData.activeMembers,
            dormant: reportData.dormantMembers,
          },
        };

        let report_data = {
          ...members,
          sender: session.user.fullName,
          data: [
            {
              description: "Total Member Deposits",
              value: reportData.memberDeposits,
            },
            {
              description: "Loan To Members",
              value: reportData.loanToMembers,
            },
            {
              description: "Total Loan Recovered",
              value: reportData.repaidLoans,
            },
            {
              description: "Interest earned on Loans",
              value: reportData.interestEarned,
            },
            {
              description: "Penalties issued",
              value: reportData.totalPenalties,
            },
            {
              description: "Earning from Penalties",
              value: reportData.paidPenalties,
            },
            {
              description: "Fines Issued",
              value: reportData.finesIssued,
            },
            {
              description: "Earning from Fines",
              value: reportData.finesPaid,
            },
            {
              description: "Members with absolute no Earning",
              value: reportData.membersWithAbsoluteNoEarning,
            },
            {
              description: "Total Earnings After deductions",
              value: reportData.sharableIncome,
            },
            {
              description: "Total Aggregated Collections",
              value: reportData.totalCollection,
            },
          ],
        };
        setTreasurerReport(report_data);
        console.log(reportData);
        return result;
      } else {
        throw new Error("Something went wrong");
      }
    };
    fetchHomePage()
      .then((each) => setHomepageData(each))
      .catch((e) => console.log(e));
  }, []);
  return (
    <>
      <Flex width={["95%", "90%", "80%"]} direction="column" mx="auto">
        <Text fontSize="1.5rem" fontWeight={"semibold"} opacity={0.8}>
          Dashboard
        </Text>

        <Text color="gray" fontWeight={".9rem"}>
          {" "}
          Manage JiraniBora finances
        </Text>
        {homePageData === null ? (
          <Spinner />
        ) : (
          <Flex
            width="100%"
            direction={["column", "column", "row"]}
            mt={10}
            flexWrap="wrap"
            justifyContent={"space-between"}
            gap={[6, 6, 2]}
          >
            <PDFDownloadLink
              fileName="Tre_report"
              document={<TresurerReport data={treasurerReport!} />}
            >
              <Button
                colorScheme="green"
                size="sm"
                gap={3}
                position="absolute"
                right={20}
                top={20}
              >
                <FaDownload /> JiraniBora Treasurer Report
              </Button>
            </PDFDownloadLink>
            <Flex
              direction="column"
              bg="white"
              shadow="sm"
              p={3}
              alignItems={["flex-start", "flex-start", "center"]}
              justifyContent={"center"}
              flex={1}
              rounded="md"
              pl={[8, 8, 0]}
            >
              <Text fontWeight="bold" fontSize="1.2rem" opacity={0.9}>
                KES {formatNumber(homePageData.totalContributions)}
              </Text>
              <Box color="twitter.600">
                <RiSecurePaymentFill fontSize="2rem" />
              </Box>
              <Text color="gray" fontSize=".9rem">
                Member Contributions
              </Text>
            </Flex>
            <Flex
              direction="column"
              bg="white"
              shadow="sm"
              p={3}
              alignItems={["flex-start", "flex-start", "center"]}
              justifyContent={"center"}
              rounded="md"
              flex={1}
              pl={[8, 8, 0]}
            >
              <Text fontWeight="bold" fontSize="1.2rem" opacity={0.9}>
                KES {formatNumber(homePageData.amountLoaned)}
              </Text>
              <Box color="blue.300" fontSize="2rem">
                <MdMoneyOff fontSize="2rem" />
              </Box>
              <Text color="gray" fontSize=".9rem">
                Amount given out
              </Text>
            </Flex>
            <Flex
              direction="column"
              bg="white"
              shadow="sm"
              p={3}
              alignItems={["flex-start", "flex-start", "center"]}
              justifyContent={"center"}
              rounded="md"
              flex={1}
              pl={[8, 8, 0]}
            >
              <Text fontWeight="bold" fontSize="1.2rem" opacity={0.9}>
                KES {formatNumber(homePageData.earningFromPenalties)}
              </Text>
              <Box color="green.400">
                <FaAdjust fontSize="2rem" />
              </Box>
              <Text color="gray" fontSize=".9rem">
                Earnings from penalties
              </Text>
            </Flex>
            <Flex
              direction="column"
              bg="white"
              shadow="sm"
              p={3}
              alignItems={["flex-start", "flex-start", "center"]}
              justifyContent={"center"}
              rounded="md"
              flex={1}
              pl={[8, 8, 0]}
            >
              <Text fontWeight="bold" fontSize="1.2rem" opacity={0.9}>
                KES {formatNumber(homePageData.interestEarned)}
              </Text>
              <Box color="green.400">
                <SiProcessingfoundation fontSize="2rem" />
              </Box>
              <Text color="gray" fontSize=".9rem">
                Interest earned
              </Text>
            </Flex>
          </Flex>
        )}
        {/* Account performance */}
        <Flex
          mt={4}
          bg="white"
          justifyContent={"space-evenly"}
          rounded="md"
          mb={10}
        >
          {homePageData !== null ? (
            <Flex direction="column" p={4} alignItems="center">
              <Text alignSelf={"flex-start"}>Available Amount</Text>
              <Box width="150px" height="150px">
                <CircularProgressbarWithChildren
                  value={
                    homePageData?.totalContributions +
                    homePageData?.earningFromPenalties +
                    homePageData?.interestEarned -
                    (homePageData.amountLoaned - homePageData.amountPaid)
                  }
                  maxValue={
                    homePageData?.totalContributions +
                    homePageData?.earningFromPenalties +
                    homePageData?.interestEarned
                  }
                  counterClockwise
                  strokeWidth={4}
                  styles={buildStyles({
                    strokeLinecap: "flat",
                  })}
                >
                  <Text fontWeight={"bold"} fontSize="1.2rem">
                    {Math.floor(
                      ((homePageData?.totalContributions +
                        homePageData?.earningFromPenalties +
                        homePageData?.interestEarned -
                        (homePageData.amountLoaned - homePageData.amountPaid)) /
                        (homePageData?.totalContributions +
                          homePageData?.earningFromPenalties +
                          homePageData?.interestEarned)) *
                        100
                    )}
                    %
                  </Text>
                  <Text color="gray">Available</Text>
                </CircularProgressbarWithChildren>
              </Box>
            </Flex>
          ) : (
            <Spinner />
          )}
          <Flex direction="column" p={4} alignItems="center">
            <Text>Loan Repayment </Text>
            <Box width="150px" height="150px">
              <CircularProgressbarWithChildren
                value={homePageData?.amountPaid!}
                maxValue={homePageData?.amountLoaned}
                strokeWidth={4}
                styles={buildStyles({
                  strokeLinecap: "flat",
                  pathColor: "#4a1cb8",
                })}
              >
                <Text fontWeight={"bold"} fontSize="1.2rem">
                  {Math.floor(
                    (homePageData?.amountPaid! / homePageData?.amountLoaned!) *
                      100
                  )}
                  %
                </Text>
                <Text>Recovered</Text>
              </CircularProgressbarWithChildren>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default TreasurerDashboard;
