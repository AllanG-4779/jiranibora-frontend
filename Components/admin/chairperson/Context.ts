import React, { Dispatch, SetStateAction } from "react";
import { RiVideoDownloadFill } from "react-icons/ri";
import {  db_application } from "../../types";

interface chairContext {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  applications: Array<db_application>|null;
  updateApplications:Dispatch<SetStateAction<Array<db_application>|null>>;
  
}
export const ChairmanContext = React.createContext<chairContext | null>(null);
