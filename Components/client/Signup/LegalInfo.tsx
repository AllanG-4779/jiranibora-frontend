import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { Target } from "framer-motion";
import { ChangeEvent, FormEvent } from "react";
import { CombinedProps, ComponentProps } from "./Utils";

const LegalInfo = ({
  userdata,
  updater,
  active,
  updateActive,
  formerrors,
  updateError,
  moveToNext,
}: CombinedProps) => {
  // validations
  const handleNationalID = (e: ChangeEvent<HTMLInputElement>) => {
    // is the input focused and empty
    if (!/^[0-9]+$/.test(e.target.value)) {
      updateError({ error: true, message: "ID cannot contain characters." });
    } else if (e.target.value.length < 7 || e.target.value.length > 10) {
      updateError({
        error: true,
        message: "Invalid ID entered, length must be between 7 and 10",
      });
    } else {
      updateError({ error: false, message: "" });
    }
    // update the state
    updater({ ...userdata, nationalId: e.target.value });
  };
  const handleDateOfBirth = (e: ChangeEvent<HTMLInputElement>) => {
    const YEAR_OF_BIRTH = parseInt(e.target.value.split("-")[0]);
    const CURRENT_YEAR = new Date().getFullYear();
    if (YEAR_OF_BIRTH + 18 > CURRENT_YEAR) {
      updateError({ error: true, message: "Only 18+ persons can apply" });
    } else if (YEAR_OF_BIRTH + 70 < CURRENT_YEAR) {
      updateError({
        error: true,
        message: `You are ${
          CURRENT_YEAR - YEAR_OF_BIRTH
        } years old. We only allow upto 70 years of age `,
      });
    } else {
      updateError({ message: "", error: false });
    }
    updater({ ...userdata, dob: e.target.value });
  };
  const handleResidence = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value == null) {
      updateError({ error: true, message: "Select a residential area" });
    } else {
      updateError({ error: false, message: "" });
    }
    updater({ ...userdata, residential: e.target.value });
  };
  return (
    <>
      <Flex mt={3} flexDir={["column"]}>
        <FormControl mb={4} isInvalid={formerrors.message.includes("ID")}>
          <FormLabel fontWeight={"semi-bold"}>National ID number</FormLabel>
          <Input
            name="nationalID"
            type="number"
            value={userdata.nationalId}
            onChange={(e) => handleNationalID(e)}
            autoFocus
          />
          <FormErrorMessage>{formerrors.message}</FormErrorMessage>
        </FormControl>
        <FormControl mb={4} isInvalid={formerrors.message.includes("18+")}>
          <FormLabel fontWeight={"semi-bold"}>Date of Birth</FormLabel>
          <Input
            name="dob"
            type="date"
            value={userdata.dob}
            onChange={(e) => handleDateOfBirth(e)}
          />
          <FormErrorMessage>{formerrors.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          mb={4}
          isInvalid={formerrors.message.includes("residential")}
        >
          <FormLabel fontWeight={"semi-bold"}>Area of residence</FormLabel>
          <Select
            placeholder="Select Residential Area"
            value={userdata.residential}
            onChange={(e) => handleResidence(e)}
          >
            <option value={"Kambi Moto"}>Kambi Moto</option>
            <option value={"Mandazi Road"}>Mandazi Road</option>
            <option value={"River Bank"}>River Bank</option>
            <option value={"Shopping Center"}>Shopping Center</option>
          </Select>
        </FormControl>
        <FormErrorMessage>{formerrors.message}</FormErrorMessage>
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
export default LegalInfo;
