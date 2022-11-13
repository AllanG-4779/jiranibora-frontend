import react, { Dispatch, SetStateAction } from "react";
import BasicInfo from "./BasicInfo";
import ConfirmDetails from "./ConfirmDetails";
import FinancialInfo from "./FinancialInfo";
import LegalInfo from "./LegalInfo";

export const steps = [
  {
    name: "Basic Information",
    component: BasicInfo,
  },
  {
    name: "Finacial Information",
    component: FinancialInfo,
  },
  {
    name: "Legal Information",
    component: LegalInfo,
  },
  {
    name: "Is this Correct? ",
    component: ConfirmDetails,
  },
];

export interface SignupData {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  nationalId?: string;
  amount?: string;
  dob?: string;
  residential?: string;
}
export interface ComponentProps {
  userdata: SignupData;
  updater: Dispatch<SetStateAction<SignupData>>;
  active:number
  updateActive: Dispatch<SetStateAction<number>>
  moveToNext: (userdata:object)=>boolean|undefined
}
export interface errors {
  error: boolean;
  message: string;
}
export interface errorProps {
  formerrors: errors;
  updateError: Dispatch<SetStateAction<errors>>;
}
export interface CombinedProps extends errorProps, ComponentProps {}
