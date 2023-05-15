import { Document, View, Page, Text } from "@react-pdf/renderer";
import styles from "./report_templates/styles";
import React from "react";
import moment from "moment";
import { formatNumber } from "../../Commons";
export type summary = {
  sender: {
    memberId: string;
    phoneNumber: string;
    name: string;
  };
  data: {
    summary: {
      interestEarned: number;
      netEarning: number;
      totalContributions: number;
      totalDeductions: number;
    };
    loans: {
      dateApproved: string;
      pendingAmount: number;
      pendingInterests: number;
      principalAmount: number;
    }[];
    fines: {
      amount: number;
      fineCategory: string;
      meetingId: string;
      status: boolean;
    }[];
    contributions: {
      contributionId: string;
      contributionMonth: string;
      amount: number;
      penalty: number;
      status: string;
    }[];
  };
};

const MemberEarningReport: React.FC<{ report: summary }> = ({ report }) => {
  return (
    <Document>
      <Page>
        <View style={{ ...styles.header, backgroundColor: "dodgerblue" }} fixed>
          <Text style={styles.title}>Personal End Year Report </Text>
          <View style={styles.location}>
            <Text>https://jirainibora.com</Text>
            <Text>info@jiranibora.com</Text>
            <Text>+254796407365</Text>
          </View>
          <View style={styles.location}>
            <Text>Busia Road, Off Enterprise Road,</Text>
            <Text>00500,</Text>
            <Text>Nairobi, Kenya.</Text>
          </View>
        </View>
        <View
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "dodgerblue",
          }}
        ></View>
        <View
          style={{
            ...styles.metadata,
            marginTop: "0px",
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.summary}>
            <View style={styles.summaryContent}>
              <Text style={styles.amount}>{report.sender.name}</Text>
              <Text style={styles.description}>Account Holder</Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.amount}>{report.sender.memberId}</Text>
              <Text style={styles.description}>Member ID</Text>
            </View>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryContent}>
              <Text style={styles.amount}>+254{report.sender.phoneNumber}</Text>
              <Text style={styles.description}>Phone number</Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.amount}>
                {report.data?.contributions.length}/12
              </Text>
              <Text style={styles.description}>Completed Contributions</Text>
            </View>
          </View>
          <View
            style={{
              ...styles.summary,
              flex: 1,
              flexDirection: "column",
              lineHeight: "1.2px",
            }}
          >
            <View style={styles.summaryContent}>
              <Text
                style={{
                  ...styles.amount,
                  fontSize: "17px",
                  color: "dodgerblue",
                }}
              >
                KES {formatNumber(report.data?.summary.netEarning)}
              </Text>
              <Text
                style={{
                  ...styles.description,
                  color: "dodgerblue",
                  opacity: 0.7,
                }}
              >
                Net Amount Received
              </Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={{ ...styles.amount, color: "#005900" }}>
                {(
                  (report.data?.summary.interestEarned /
                    report.data?.summary.totalContributions) *
                  100
                ).toFixed(2)}
                %
              </Text>
              <Text style={styles.description}>Earning on Contribution</Text>
            </View>
          </View>
        </View>
        {report.data !== null ? (
          <View id="body" style={styles.body}>
            <View
              id="line"
              style={{
                height: "2px",
                backgroundColor: "dodgerblue",
                width: "110%",
                margin: "auto",
                marginLeft: "-23px",
              }}
            ></View>
            <Text
              style={{
                color: "dodgerblue",
                fontSize: "17px",
                fontWeight: "bold",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Detailed Financial Description - (2022)
            </Text>

            <View id="contributions" style={{ marginTop: "10px" }}>
              <Text style={styles.section}>Contributions</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={{ ...styles.tableColumn, width: "20%" }}>
                    <Text>Contribution ID</Text>
                  </View>
                  <View style={{ ...styles.tableColumn, width: "20%" }}>
                    <Text>Contribution Month</Text>
                  </View>
                  <View style={{ ...styles.tableColumn, width: "20%" }}>
                    <Text>Contribution Amount</Text>
                  </View>
                  <View style={{ ...styles.tableColumn, width: "20%" }}>
                    <Text>Penalty Amount</Text>
                  </View>
                  <View style={{ ...styles.tableColumn, width: "20%" }}>
                    <Text>Status</Text>
                  </View>
                </View>
                {report.data?.contributions.map((each) => {
                  return (
                    <View style={styles.tableRow} key={each.contributionId}>
                      <View style={{ ...styles.tableColumn, width: "20%" }}>
                        <Text>{each.contributionId}</Text>
                      </View>
                      <View style={{ ...styles.tableColumn, width: "20%" }}>
                        <Text>{each.contributionMonth}</Text>
                      </View>
                      <View style={{ ...styles.tableColumn, width: "20%" }}>
                        <Text color="#3A7F3E">{each.amount}</Text>
                      </View>
                      <View style={{ ...styles.tableColumn, width: "20%" }}>
                        <Text
                          style={{
                            color:
                              each.status === "Paid" ? "#3A7F3E" : "#AC2828",
                          }}
                        >
                          {each.penalty}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableColumn, width: "20%" }}>
                        <Text
                          style={{
                            color:
                              each.status === "Paid" ? "#3A7F3E" : "#AC2828",
                          }}
                        >
                          {each.status}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  ...styles.tableRow,
                  ...styles.total,

                  borderTopColor: "transparent",
                }}
              >
                <View style={{ ...styles.tableColumn, width: "40%" }}>
                  <Text style={{ fontSize: "15px" }}>Total</Text>
                </View>
                <View style={{ ...styles.tableColumn, width: "20%" }}>
                  <Text
                    style={{ fontSize: "13px", width: "20%", color: "#3A7F3E" }}
                  >
                    {formatNumber(report.data?.summary.totalContributions)}
                  </Text>
                </View>

                <View style={{ ...styles.tableColumn, width: "20%" }}>
                  <Text
                    style={{ fontSize: "13px", width: "20%", color: "#3A7F3E" }}
                  >
                    {formatNumber(
                      report.data?.contributions
                        .filter((each) => each.status === "Paid")
                        .reduce((prev, curr) => prev + curr.penalty, 0)
                    )}
                  </Text>
                </View>
                <View style={{ ...styles.tableColumn, width: "20%" }}>
                  <Text
                    style={{ fontSize: "13px", width: "20%", color: "#AC2828" }}
                  >
                    {formatNumber(
                      report.data?.contributions
                        .filter((each) => each.status !== "Paid")
                        .reduce((prev, curr) => prev + curr.penalty, 0)
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View id="Loans">
              <Text style={styles.section}>Loans</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColumn}>
                    <Text>Date Approved</Text>
                  </View>
                  <View style={styles.tableColumn}>
                    <Text>Amount Borrowed</Text>
                  </View>
                  <View style={styles.tableColumn}>
                    <Text>Pending Interest</Text>
                  </View>
                  <View style={styles.tableColumn}>
                    <Text>Pending Amount</Text>
                  </View>
                </View>
                {report.data?.loans.map((each) => {
                  return (
                    <View style={styles.tableRow} key={each.dateApproved}>
                      <View style={styles.tableColumn}>
                        <Text>{moment(each.dateApproved).format("ll")}</Text>
                      </View>
                      <View style={styles.tableColumn}>
                        <Text>{each.principalAmount}</Text>
                      </View>
                      <View style={styles.tableColumn}>
                        <Text>{each.pendingInterests}</Text>
                      </View>
                      <View style={styles.tableColumn}>
                        <Text>{each.pendingAmount}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  ...styles.tableRow,
                  ...styles.total,
                  border: "1px solid #d3d3d3",
                  padding: "5px",
                  borderTopColor: "transparent",
                }}
              >
                <Text style={{ fontSize: "15px", color: "#4b4b4b" }}>
                  Total Loan Balance Deducted
                </Text>
                <Text style={{ fontSize: "13px" }}>
                  {report.data?.loans.reduce(
                    (prev, curr) =>
                      prev + curr.pendingAmount + curr.pendingInterests,
                    0
                  )}
                </Text>
              </View>
            </View>
            {/* amount: number; fineCategory: string; meetingId: string; status:
          boolean; */}
            <View id="fines">
              <Text style={styles.section}>Fines</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColumn}>
                    <Text>Meeting ID</Text>
                  </View>
                  <View style={styles.tableColumn}>
                    <Text>Fine Category</Text>
                  </View>
                  <View style={styles.tableColumn}>
                    <Text>Amount</Text>
                  </View>
                  <View style={styles.tableColumn}>
                    <Text>Paid</Text>
                  </View>
                </View>
                {report.data?.fines.map((each) => {
                  return (
                    <View style={styles.tableRow} key={each.meetingId}>
                      <View style={styles.tableColumn}>
                        <Text>{each.meetingId}</Text>
                      </View>
                      <View style={styles.tableColumn}>
                        <Text>{each.fineCategory}</Text>
                      </View>
                      <View style={styles.tableColumn}>
                        <Text>{each.amount}</Text>
                      </View>
                      <View style={styles.tableColumn}>
                        <Text>{each.status ? "Yes" : "No"}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  ...styles.tableRow,
                  ...styles.total,
                  border: "1px solid #d3d3d3",
                  padding: "5px",
                  borderTopColor: "transparent",
                }}
              >
                <Text style={{ fontSize: "15px", color: "#4b4b4b" }}>
                  Fines Deducted
                </Text>
                <Text style={{ fontSize: "13px" }}>
                  {report.data?.fines
                    .filter((each) => !each.status)
                    .reduce((prev, curr) => prev + curr.amount, 0)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          ""
        )}
        <View fixed style={{ ...styles.footer, backgroundColor: "dodgerblue" }}>
          <Text>Jirani Bora Savings And Credit</Text>
          <Text>&copy; 2022</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MemberEarningReport;
