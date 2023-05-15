import axios from "axios";
import jwtDecode from "jwt-decode";
import { getSession, signOut } from "next-auth/react";
import React from "react";

import { backendJWT, clientData, sessionType } from "./Components/types";
import { NextRouter } from "next/router";

// post data to external API
type postParams = {
  data?: Object;
  url: string;
  token?: string;
  method?: string;
};

export const clientPost = async (params: postParams) => {
  const { url, data, token, method } = params;
  let headers = {};
  if (token) {
    headers = { Authorization: `Bearer ${token}` };
  }
  try {
    const post = await axios({
      method,
      url: `${process.env.NEXT_PUBLIC_URL}/${url}`,
      headers,
      data,
    });
    console.log("The info being posted to " + url + " is " + post);
    if (post.status < 300) {
      return post.status;
    }
  } catch (e: any) {
    console.log(e.response);
    return e.response.status;
  }
};

export const fetchData = async (params: postParams) => {
  console.log(params);
  let headers = {};
  if (params.token) {
    headers = { Authorization: `Bearer ${params.token}` };
  }
  try {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/${params.url}`,
      {
        headers,
      }
    );
    if (data.data) {
      console.log(data);
      return data.data;
    }
  } catch (e: any) {
    console.log(e.response.status);
    return null;
  }
};
export const fetchToken = async () => {
  const token = (await getSession()) as sessionType;
  if (token) {
    return token.user.access_token;
  }
};
export const isTokenExpired = (token: string) => {
  const expiry = jwtDecode(token) as backendJWT;
  // if the token is expired redirect the user
  return new Date().getTime() / 1000 > expiry.exp;
};

export const ClientContext = React.createContext<clientData | null>(null);
export const TokenContext = React.createContext({
  token: "",
  pendingConts: 0,
});
// Give the date time in ISO format extract it to time and day
export const getTimeDetails = (dateString: string | undefined) => {
  if (typeof dateString !== "undefined") {
    const dateTime = dateString.split("T");
    const time = dateTime[1].split(".")[0];
    const date = dateTime[0];
    return { date, time };
  } else {
    return { date: "", time: "" };
  }
};
export const dateDescription = (dateString: string | undefined) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (typeof dateString !== "undefined") {
    // Split the dates into months and year
    const splitedDate = dateString.split("-");
    const year = splitedDate[0];
    const month = splitedDate[1].startsWith("0")
      ? splitedDate[1].replace("0", "")
      : splitedDate[1];
    const day = splitedDate[2].startsWith("0")
      ? splitedDate[2].replace("0", "")
      : splitedDate[2];

    return `${months[parseInt(month) - 1].toUpperCase()} ${day}, ${year}`;
  }
};
export const formatNumber = (amount: any) => {
  let newNumber = amount?.toString();
  let decimal = "";
  if (typeof newNumber !== "undefined" && newNumber !== null) {
    if (newNumber?.includes(".")) {
      decimal = "." + newNumber.split(".")[1];
      newNumber = newNumber.split(".")[0];
    }
    let init = "";
    if (newNumber.length % 3 !== 0) {
      init = newNumber.slice(0, newNumber.length % 3);
      newNumber = newNumber.slice(newNumber.length % 3);
    }
    let startIndex = 0;
    while (startIndex < newNumber.length) {
      init += "," + newNumber.slice(startIndex, startIndex + 3);
      startIndex += 3;
    }
    if (init.startsWith(",")) {
      init = init.slice(1);
    }
    return init + decimal;
  }
};
const hasTokenExpired = (currentTime: number) => {
  return new Date().getTime() / 1000 > currentTime;
};
//Find and return session to the client
export const checkAuthStatusAndReturnToken = async (
  router: NextRouter,
  role: string,
  destination = "/admin/login"
) => {
  //  First determine if there is session
  const session = (await getSession()) as sessionType;
  if (session) {
    //  Check if the current backend token is expired
    const backendTokenExpiry = jwtDecode(
      session.user.access_token
    ) as backendJWT;
    if (
      hasTokenExpired(backendTokenExpiry.exp) ||
      !session.user.role.split(";").includes(role)
    ) {
      signOut({ callbackUrl: "/admin/login" });
      await router.push(destination);
    }
    return session.user.access_token;
  } else {
    await router.push("/admin/login");
  }
};
