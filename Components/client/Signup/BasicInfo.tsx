import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useRef } from "react";
import { emailValid, phoneValid } from "../Login/Validation";

import { CombinedProps } from "./Utils";

const BasicInfo = ({
  userdata,
  updater,
  formerrors,
  updateError,
  active,
  updateActive,
  moveToNext,
}: CombinedProps) => {
  const firstName = useRef<HTMLInputElement>(null);

  // As the input changes
  const handleFirstNameEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    //  make your validations here
    if (e.target.value.length < 3) {
      updateError({ error: true, message: "first name is required" });
    } else {
      updateError({ error: false, message: "" });
    }
    return updater({ ...userdata, firstName: e.target.value });
  };

  // validate second Name
  const handleSecondNameEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 3) {
      updateError({ error: true, message: "Last name is required" });
    } else {
      updateError({ error: false, message: "" });
    }
    return updater({ ...userdata, lastName: e.target.value });
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 9 || e.target.value.length > 9) {
      updateError({
        error: true,
        message: "Phone number length must be within 9-12",
      });
    } else if (!phoneValid(e.target.value)) {
      updateError({
        error: true,
        message: "Do not include the leading zero",
      });
    } else {
      updateError({ error: false, message: "" });
    }
    return updater({ ...userdata, phoneNumber: e.target.value });
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!emailValid(e.target.value)) {
      updateError({
        error: true,
        message: "Provide a valid email address e.g someone@dormain",
      });
    } else {
      updateError({ error: false, message: "" });
    }
    updater({ ...userdata, emailAddress: e.target.value });
  };

  return (
    <>
      <Flex mt={3} flexDir={["column"]}>
        <FormControl mb={4} isInvalid={formerrors.message.startsWith("first")}>
          <FormLabel fontWeight={"semi-bold"}>First Name</FormLabel>
          <Input
            placeholder="e.g. John Doe"
            name="firstName"
            type="text"
            
            value={userdata!.firstName}
            ref={firstName}
            onChange={(e) => handleFirstNameEvent(e)}
            autoFocus
          />
          <FormErrorMessage>{formerrors.message}</FormErrorMessage>
        </FormControl>
        <FormControl mb={4} isInvalid={formerrors.message.startsWith("Last")}>
          <FormLabel fontWeight={"semi-bold"}>Last Name</FormLabel>
          <Input
            placeholder="e.g. John Doe"
            name="firstName"
            type="text"
            value={userdata.lastName}
            onChange={(e) => handleSecondNameEvent(e)}
          />
          <FormErrorMessage>{formerrors.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          mb={4}
          isInvalid={
            formerrors.message.startsWith("Phone") ||
            formerrors.message.startsWith("Do not")
          }
        >
          <FormLabel fontWeight={"semi-bold"}>Phone number</FormLabel>{" "}
          <InputGroup>
            <InputLeftAddon>+254</InputLeftAddon>
            <Input
              name="email"
              type="number"
              value={userdata.phoneNumber}
              onChange={(e) => handlePhone(e)}
            />
          </InputGroup>
          <FormErrorMessage>{formerrors.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          mb={4}
          isInvalid={formerrors.message.startsWith("Provide")}
        >
          <FormLabel fontWeight={"semi-bold"}>Email address</FormLabel>
          <Input
            placeholder="e.g. johndoe@domain.com"
            name="email"
            type="email"
            value={userdata.emailAddress}
            onChange={(e) => handleEmail(e)}
          />
          <FormErrorMessage>{formerrors.message}</FormErrorMessage>
        </FormControl>
        <Flex
          width={"50%"}
          justifyContent={"flex-end"}
          p={2}
          gap={5}
          align="center"
        >
          <Button
            disabled={active === 0 ? true : false}
            variant={"ghost"}
            size={"sm"}
            colorScheme="green"
            onClick={() => {
              updateActive((prev) => prev - 1);
            }}
          >
            Prev
          </Button>
          <Button
            size="sm"
            bg={"primary.900"}
            _hover={{ bg: "primary.800" }}
            color="white"
            onClick={() => {
              return updateActive((prev) => prev + 1);
            }}
            disabled={moveToNext(userdata) ? true : false}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
export default BasicInfo;
