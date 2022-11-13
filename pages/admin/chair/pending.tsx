import axios from "axios";
import { isBefore } from "date-fns";
import jwtDecode from "jwt-decode";
import { getSession } from "next-auth/react";
import { useContext } from "react";
import Landing from "../../../Components/admin/chairperson/Landing";
import Pending from "../../../Components/admin/chairperson/Pending";
import {
  backendJWT,
  db_application,
  sessionType,
} from "../../../Components/types";

const Pen = (props: any) => {
  return (
    <>
      <Pending pending={props.pending} success={props.success} />
    </>
  );
};
Pen.PageLayout = Landing;
export default Pen;
export const getServerSideProps = async (context: any) => {
  let pending: Array<db_application> = [];

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

    if (session.user.role.split(";").includes("CHAIR")) {
      const req = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/application/all`,
        {
          headers: { Authorization: `Bearer ${session.user.access_token}` },
        }
      );

      if (req.data) {
        pending = req.data?.filter((each: db_application) => {
          return each.status == "Pending";
        });
      }
      return {
        props: {
          pending: pending,
          success: true,
        },
      };
    } else {
      return {
        props: {
          pending: [],
          success: false,
        },
      };
    }
  }
};
