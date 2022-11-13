import axios from "axios";
import { isBefore } from "date-fns";
import jwtDecode from "jwt-decode";
import { getSession } from "next-auth/react";
import { Data } from "react-minimal-pie-chart/types/commonTypes";
import Approved from "../../../Components/admin/chairperson/Approved";
import Landing from "../../../Components/admin/chairperson/Landing";
import {
  backendJWT,
  db_application,
  sessionType,
} from "../../../Components/types";

const Appr = (props: any) => {
  return (
    <>
      <Approved approved={props.approved} success={props.success} />
    </>
  );
};
Appr.PageLayout = Landing;
export default Appr;

export const getServerSideProps = async (context: any) => {
  // get the approved applications
  const session = (await getSession(context)) as sessionType;
  if (!session) {
    return {
      redirect: {
        destination: "/admin/login",
      },
      props: {},
    };
  }
  if (session) {
    const expiry = jwtDecode(session.user.access_token) as backendJWT;
    // if the token is expired redirect the user
    if (!(new Date().getTime() / 1000 <= expiry.exp)) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
        props: {},
      };
    }
    if (session && session.user.role.split(";").includes("CHAIR")) {
      const req = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/application/all`,
        {
          headers: { Authorization: `Bearer ${session.user.access_token}` },
        }
      );

      if (req.data) {
        return {
          props: {
            success: true,
            approved: req.data.filter(
              (application: db_application) => application.status === "Approved"
            ),
          },
        };
      }
    } else {
      return {
        props: {
          approved: [],
          success: false,
        },
      };
    }
  }
};
