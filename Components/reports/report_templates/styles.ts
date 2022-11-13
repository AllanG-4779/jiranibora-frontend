import { background } from "@chakra-ui/react";
import { lineHeight } from "@mui/system";
import { StyleSheet } from "@react-pdf/renderer";
import { SiWhitesource } from "react-icons/si";
export default StyleSheet.create({
  table: {
    border: "1px solid #d3d3d3",

    width: "auto",
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColumn: {
    width: "25%",
    padding: "5px",
    border: "1px solid #d3d3d3",

    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: "10px",
  },
  header: {
    height: "70px",
    backgroundColor: "#008838",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: "20px",
    color: "white",
    fontWeight: "bold",
  },
  location: {
    opacity: 0.8,
    color: "white",
    fontSize: "11px",
    lineHeight: "1.5px",
    alignItems: "flex-end",
    display: "flex",
  },
  footer: {
    height: "40px",
    backgroundColor: "#008838",
    width: "100%",
    position: "absolute",
    bottom: 0,
    color: "white",
    fontSize: "11px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  metadata: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "20px",

    padding: "5px",
  },
  metadesc: {
    fontSize: "12px",
    color: "gray",
    marginBottom: "5px",
  },
  metadataContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "85px",
    flexBasis: "120px ",
  },
  metadataContent: {
    fontSize: "11px",
    color: "black",
    opacity: 0.8,
  },
  members: {
    fontSize: "30px",
    color: "#008838",
  },
  memberdesc: {
    fontSize: "15px",
  },
  content: {
    width: "80%",
    margin: "auto",
    display: "flex",
    backgroundColor: "red",
    height: "20px",
  },
  body: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px",
  },
  summary: {
    display: "flex",
    padding: "10px",
    justifyContent: "space-between",
    marginTop: 0,
    lineHeight: "1.4px",
    flexDirection: "column",
    flex: 1,
    height: "100px",
  },
  amount: {
    fontSize: "13px",
    color: "#4b4b4b",
  },
  description: {
    color: "gray",
    fontSize: "11px",
  },
  summaryContent: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  section: {
    marginBottom: "10px",
    textAlign: "center",
    color: "#4b4b4b",
    fontWeight: "bold",
  },
  total: {
    display: "flex",
    marginBottom: "20px",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderTopColor: "white",
  },
});
