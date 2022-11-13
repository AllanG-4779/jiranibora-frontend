import { Box, VStack, Text, Badge, Flex } from "@chakra-ui/react";
import { ComponentProps } from "./Utils";
import { CustomBadge, FieldContent, FieldDesc } from "./Miscelleneous";

interface SignupProps {
  active: number;
}

const ConfirmDetails = ({ userdata }: ComponentProps) => {
  return (
    <>
      <VStack
        display={["flex"]}
        flexDir={["column"]}
        justify="space-between"
        gap={1}
        mt={3}
      >
        <Box
          width="100%"
          justifyContent={"space-between"}
          borderBottom="1px"
          borderColor={"gray.300"}
        >
          <CustomBadge child={"Personal Details"} />
          <Flex
            flexDir={["column", "row"]}
            gap={1}
            justify={["", "space-between"]}
          >
            <FieldDesc child={"Full Name"} />
            <FieldContent
              child={`${userdata.firstName} ${userdata.lastName}`}
            />
          </Flex>
          <Flex
            flexDir={["column", "row"]}
            gap={1}
            justify={["", "space-between"]}
          >
            <FieldDesc child={"Email ID"} />
            <FieldContent child={`${userdata.emailAddress}`} />
          </Flex>
          <Flex
            flexDir={["column", "row"]}
            gap={1}
            justify={["", "space-between"]}
          >
            <FieldDesc child={"Phone number"} />
            <FieldContent child={`+254${userdata.phoneNumber}`} />
          </Flex>
        </Box>
        <Box
          width="100%"
          justifyContent={"space-between"}
          borderBottom="1px"
          borderColor={"gray.300"}
        >
          <CustomBadge child={"Legal Information"} />
          <Flex
            flexDir={["column", "row"]}
            gap={1}
            justify={["", "space-between"]}
          >
            <FieldDesc child={"National ID"} />
            <FieldContent child={`${userdata.nationalId}`} />
          </Flex>
          <Flex
            flexDir={["column", "row"]}
            gap={1}
            justify={["", "space-between"]}
          >
            <FieldDesc child={"D.O.B"} />
            <FieldContent child={`${userdata.dob}`} />
          </Flex>
          <Flex
            flexDir={["column", "row"]}
            gap={1}
            justify={["", "space-between"]}
          >
            <FieldDesc child={"Residential area"} />
            <FieldContent child={`${userdata.residential}`} />
          </Flex>
        </Box>
        <Box
          width="100%"
          justifyContent={"space-between"}
          padding={2}
          borderBottom="1px"
          borderColor={"gray.300"}
        >
          <CustomBadge child={"Financial Information"} />
          <Flex
            flexDir={["column", "row"]}
            gap={1}
            justify={["", "space-between"]}
          >
            <FieldDesc child={"Monthly contribution"} />
            <FieldContent child={`KES ${userdata.amount}`} />
          </Flex>
        </Box>
      </VStack>
    </>
  );
};
export default ConfirmDetails;
