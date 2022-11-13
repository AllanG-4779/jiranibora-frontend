import HomeComponent from "../../../Components/admin/chairperson/HomeComponent";
import Landing from "../../../Components/admin/chairperson/Landing";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import {
  application,
  backendJWT,
  sessionType,
} from "../../../Components/types";
import { useContext } from "react";
import { ChairmanContext } from "../../../Components/admin/chairperson/Context";
import { getDate, getTime, isBefore } from "date-fns";
import jwtDecode from "jwt-decode";
import { isAfter } from "date-fns/esm";
import {isTokenExpired} from "../../../Commons";

const Dashboard = (props: any) => {
  // update the context

  return (
    <>
      <HomeComponent status={props.status} users={props.users} />
    </>
  );
};
Dashboard.PageLayout = Landing;
export default Dashboard;

export const getServerSideProps = async (context: any) => {
  // Redirect the use if there is no session at all
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
    if (isTokenExpired(session.user.access_token)|| !session.user.role.split(";").includes("CHAIR")) {
      console.log(
        `Miliseconds left session is destroyed ${getTime(new Date()) / 1000}`
      );
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
        props: {},
      };
    }
  }
  // We are sure there is a session available and the backend token has not expired
  if (session && session?.user?.role.split(";").includes('CHAIR')) {
    
    console.log("You have been redirected");
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/application/all`,
      {
        headers: { Authorization: `Bearer ${session.user.access_token}` },
      }
    );

    return {
      props: {
        success: true,
        users: req.data,
      },
    };
  }
  else{
    return {
      props:{}
    }
  }
};
