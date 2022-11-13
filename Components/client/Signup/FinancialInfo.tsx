import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CombinedProps, ComponentProps } from "./Utils";
// combine the props

const FinancialInfo = ({
  userdata,
  updater,
  active,
  updateActive,
  moveToNext,
  formerrors,
  updateError,
}: CombinedProps) => {
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 500) {
      updateError({ error: true, message: "Minimum amount KES 500" });
    } else if (parseInt(e.target.value) > 15000) {
      updateError({ error: true, message: "Maximum amount is KES 15,000" });
    } else {
      updateError({ error: false, message: "" });
    }
    updater({ ...userdata, amount: e.target.value });
  };

  return (
    <>
      <Flex mt={3} flexDir={["column"]}>
        <FormControl
          mb={4}
          isRequired
          isInvalid={
            formerrors.message.startsWith("Minimum") ||
            formerrors.message.startsWith("Maximum")
          }
        >
          <FormLabel fontWeight={"semi-bold"}>Amount willing to pay</FormLabel>
          <InputGroup>
            <InputLeftAddon>KES</InputLeftAddon>
            <Input
              placeholder="0e.g 1000"
              name="monthlyCont"
              type="number"
              value={userdata.amount}
              onChange={(e) => handleAmount(e)}
              autoFocus
              isRequired={true}
            />
          </InputGroup>
          {userdata.amount?.length == 0 ? (
            <FormHelperText>Minimum amount is KES500</FormHelperText>
          ) : (
            <FormErrorMessage>{formerrors.message}</FormErrorMessage>
          )}
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
export default FinancialInfo;
