import Landing from "../../../../Components/admin/chairperson/Landing";
import "react-circular-progressbar/dist/styles.css";
import Applications from "../../../../Components/admin/chairperson/Applications";
import axios from "axios";
import {
  backendJWT,
  db_application,
  sessionType,
} from "../../../../Components/types";
import { getSession } from "next-auth/react";
import { FaHourglassEnd } from "react-icons/fa";
import jwtDecode from "jwt-decode";
import isBefore from "date-fns/isBefore";

const Application = (props: any) => {
  return (
    <Applications applications={props.applications} success={props.success} />
  );
};
Application.PageLayout = Landing;
export default Application;

export const getServerSideProps = async (context: any) => {
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
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/application/all`,
        {
          headers: { Authorization: `Bearer ${session.user.access_token}` },
        }
      );

      if (res.data) {
        return {
          props: {
            applications: res.data,
            success: true,
          },
        };
      }
    } else {
      return {
        props: {
          applications: [],
          success: false,
        },
      };
    }
  }
};
