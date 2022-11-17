import React, { useEffect, useState } from "react";
import styles from "./report_templates/styles";

import { Document, Text, View, Page, PDFViewer } from "@react-pdf/renderer";
import { transactionType } from "../types";
import { dateDescription, formatNumber, getTimeDetails } from "../../Commons";
import { format } from "date-fns";
import moment from "moment";

export const TrxPDF = (props: any) => {
  const transactions: transactionType[] = props.transactions;
  return (
    <Document>
      <Page
        size={"A4"}
        wrap={true}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <View
          id="header"
          style={{
            backgroundColor: "#2e86d2",

            height: "70px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            padding: "10px",
            justifyContent: "space-between",
          }}
          fixed
        >
          <Text
            style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}
          >
            Transaction Statement
          </Text>
          <View
            style={{
              color: "white",
              opacity: 0.8,
              fontSize: "11px",
              lineHeight: "1.5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Text>+254796407365</Text>
            <Text>info@jiranibora.com</Text>
            <Text>https://jiranibora.com</Text>
          </View>
          <View
            style={{
              color: "white",
              opacity: 0.8,
              fontSize: "11px",
              lineHeight: "1.5px",
              marginLeft: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Text>Busia Road, Off Enterprise Road</Text>
            <Text>Nairobi, Kenya</Text>
            <Text>00500</Text>
          </View>
        </View>
        <View
          id="recipient"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "30px",
            marginTop: "20px",
            fontSize: "12px",
            lineHeight: "1.5px",
          }}
        >
          <View
            id="member"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              flex: 1.5,

              height: "110px",
            }}
          >
            <View>
              <Text style={{ color: "gray" }}>Owner</Text>
              <Text>{props.sender!.name}</Text>
            </View>
            <View>
              <Text style={{ color: "gray" }}>Member ID</Text>
              <Text>{props.sender!.memberId}</Text>
            </View>
            <View>
              <Text style={{ color: "gray" }}>Contact</Text>
              <Text>+254{props.sender!.phone}</Text>
            </View>
          </View>
          <View
            id="metadata"
            style={{
              display: "flex",
              flex: 1.5,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ color: "gray", fontSize: "12px" }}>
                Generated On
              </Text>
              <Text>{moment().format("llll")}</Text>
            </View>
            <View>
              <Text style={{ color: "gray", fontSize: "12px" }}>
                Transaction Period
              </Text>
              <Text>All Time</Text>
            </View>
          </View>
          <View
            id="summary"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 2,
              marginLeft: "10px",
            }}
          >
            <View id="total">
              <Text style={{ color: "gray" }}>Total Amount Transacted</Text>
              <Text style={{ fontSize: "30px", color: "#2e86d2" }}>
                KES{" "}
                {formatNumber(
                  transactions.reduce(
                    (prev, value) => prev + value.transactionAmount,
                    0
                  )
                )}
              </Text>
            </View>
            <View
              id="aggregated"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                id="fines_penalties"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Text style={{ fontSize: "9px", color: "gray" }}>Fines</Text>
                <Text style={{ color: "#d74c38" }}>
                  {" "}
                  {formatNumber(
                    transactions
                      .filter(
                        (each) =>
                          each.transactioncategory === "Penalty" ||
                          each.transactioncategory === "Fine"
                      )
                      .reduce(
                        (prev, current) => prev + current.transactionAmount,
                        0
                      )
                  )}
                </Text>
              </View>
              <View
                id="contributions"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Text style={{ fontSize: "9px", color: "gray" }}>Loans</Text>
                <Text style={{ color: "#f2c200" }}>
                  {formatNumber(
                    transactions
                      .filter(
                        (each) => each.transactioncategory === "Loan Repayment"
                      )
                      .reduce(
                        (prev, current) => prev + current.transactionAmount,
                        0
                      )
                  )}
                </Text>
              </View>
              <View
                id="loans"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Text style={{ fontSize: "9px", color: "gray" }}>
                  Contributions
                </Text>
                <Text style={{ color: "#20b130" }}>
                  {" "}
                  {formatNumber(
                    transactions
                      .filter(
                        (each) => each.transactioncategory === "Contribution"
                      )
                      .reduce(
                        (prev, current) => prev + current.transactionAmount,
                        0
                      )
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <View
            style={{
              backgroundColor: "#2e86d2",
              padding: "1px",
              width: "100%",
              marginBottom: "50px",
            }}
          ></View>
          <Text
            style={{
              textAlign: "center",
              color: "#2e86d2",
              marginBottom: "9px",
            }}
          >
            Detailed Statement
          </Text>
          <View id="table" style={styles.table}>
            <View
              style={{
                ...styles.tableRow,
                color: "white",
                backgroundColor: "dodgerblue",
                fontSize: "12px",
              }}
            >
              <View
                style={{ ...styles.tableColumn, borderColor: "dodgerblue" }}
              >
                <Text> ID</Text>
              </View>
              <View
                style={{ ...styles.tableColumn, borderColor: "dodgerblue" }}
              >
                <Text>Description</Text>
              </View>
              <View
                style={{
                  ...styles.tableColumn,

                  width: "15%",
                }}
              >
                <Text style={{ textAlign: "center" }}>Amt In</Text>
              </View>
              <View
                style={{
                  ...styles.tableColumn,

                  width: "15%",
                }}
              >
                <Text style={{ textAlign: "center" }}>Amt Out</Text>
              </View>
              <View
                style={{ ...styles.tableColumn, borderColor: "dodgerblue" }}
              >
                <Text>Date</Text>
              </View>
            </View>
            {transactions.map((each) => (
              <View style={styles.tableRow} key={each.transactionId}>
                <View style={styles.tableColumn}>
                  <Text>{each.transactionId}</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text>{each.transactioncategory}</Text>
                </View>
                <View
                  style={{
                    ...styles.tableColumn,

                    width: "15%",
                  }}
                >
                  {each.transactioncategory === "Contribution" ? (
                    <Text style={{ color: "#3A7F3E" }}>
                      +KES{each.transactionAmount}
                    </Text>
                  ) : (
                    ""
                  )}
                </View>
                <View
                  style={{
                    ...styles.tableColumn,

                    width: "15%",
                  }}
                >
                  {each.transactioncategory !== "Contribution" ? (
                    <Text style={{ color: "#AC2828" }}>
                      -KES{each.transactionAmount}
                    </Text>
                  ) : (
                    ""
                  )}
                </View>
                <View style={styles.tableColumn}>
                  <Text>
                    {moment(each.transactionDate).add(3, "hours").format("lll")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              ...styles.tableRow,
              border: "1px solid #d3d3d3",
              borderTopColor: "white",
            }}
          >
            <View style={{ ...styles.tableColumn, width: "50%" }}>
              <Text style={{ fontWeight: "bold", fontSize: "17px" }}>
                Total
              </Text>
            </View>
            <View style={{ ...styles.tableColumn, width: "15%" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  color: "#3A7F3E",
                }}
              >
                {formatNumber(
                  transactions
                    .filter(
                      (each) => each.transactioncategory === "Contribution"
                    )
                    .reduce(
                      (prev, current) => prev + current.transactionAmount,
                      0
                    )
                )}
              </Text>
            </View>
            <View style={{ ...styles.tableColumn, width: "15%" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  color: "#AC2828",
                }}
              >
                {" "}
                {formatNumber(
                  transactions
                    .filter(
                      (each) =>
                        each.transactioncategory === "Penalty" ||
                        each.transactioncategory === "Fine" ||
                        each.transactioncategory === "Loan Repayment"
                    )
                    .reduce(
                      (prev, current) => prev + current.transactionAmount,
                      0
                    )
                )}
              </Text>
            </View>
            <View style={{ ...styles.tableColumn, width: "25%" }}></View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const TransactionPDF = (props: any) => {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  return <TrxPDF transactions={props.transactions} />;
};
