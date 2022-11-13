import { Badge, Input, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

type Child = {
  child: string;
};
export const CustomBadge = ({ child }: Child) => {
  return (
    <>
      <Badge
        colorScheme="green"
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
        rounded="lg"
        color="green.600"
        mb={4}
      >
        {child}
      </Badge>
    </>
  );
};
export const FieldDesc = ({ child }: Child) => {
  return (
    <>
      <Text color={"#8390ac"} fontFamily={"body"}>
        {child}
      </Text>
    </>
  );
};

export const FieldContent = ({ child }: Child) => {
  return (
    <>
      <Text color="black.500">{child}</Text>
    </>
  );
};

type Props = {
  data: string;
};

export const OTPInputBox: React.FC<Props> = ({ data }) => {
  return (
    <Text
      width={20}
      p={10}
      borderColor={"gray.400"}
      borderWidth=".4px"
      textAlign={"center"}
      rounded="md"
    >
      {data}
    </Text>
  );
};
