import axios from "axios";
import { isBefore } from "date-fns";
import jwtDecode from "jwt-decode";
import { getSession } from "next-auth/react";
import Disapproved from "../../../Components/admin/chairperson/Disapproved";
import Landing from "../../../Components/admin/chairperson/Landing";
import {
  backendJWT,
  db_application,
  sessionType,
} from "../../../Components/types";

const Dis = (props: any) => {
  return (
    <>
      <Disapproved disapproved={props.declined} success={props.success} />
    </>
  );
};
Dis.PageLayout = Landing;
export default Dis;

export const getServerSideProps = async (context: any) => {
  let disapproved: Array<db_application> = [];

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

    if (session && session.user.role.split("CHAIR")) {
      const req = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/application/all`,
        {
          headers: {
            Authorization: `Bearer ${session.user.access_token}`,
          },
        }
      );

      if (req.data) {
        disapproved = req.data?.filter((each: db_application) => {
          return each.status == "Declined";
        });
      }
      return {
        props: {
          declined: disapproved,
          success: true,
        },
      };
    } else {
      return {
        props: {
          declined: [],
          success: false,
        },
      };
    }
  }
};
