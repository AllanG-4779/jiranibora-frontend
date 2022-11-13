import axios from "axios";
import jwtDecode from "jwt-decode";
import { getSession } from "next-auth/react";
import Landing from "../../../../Components/admin/chairperson/Landing";
import EachApplication from "../../../../Components/admin/chairperson/SpecificApplication";
import {
  backendJWT,
  db_application,
  sessionType,
} from "../../../../Components/types";

const SpecApplication = (props: any) => {
  const application: db_application = props?.application;

  return (
    <>
      <EachApplication application={application} />
    </>
  );
};
SpecApplication.PageLayout = Landing;
export default SpecApplication;

export const getServerSideProps = async (context: any) => {
  const session = (await getSession(context)) as sessionType;
  if (!session) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
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
      try {
        const req = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/application/all/${context.params?.applicationId}`,
          {
            headers: { Authorization: `Bearer ${session.user.access_token}` },
          }
        );

        return {
          props: {
            application: req.data,
          },
        };
      } catch (e) {
        return {
          props: {
            application: null,
          },
        };
      }
    } else {
      return {
        props: {
          application: null,
        },
      };
    }
  }
};
