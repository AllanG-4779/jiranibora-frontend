import {
  Flex,
  Text,
  Input,
  VStack,
  Heading,
  Button,
  FormControl,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { RiCloseCircleLine } from "react-icons/ri";
import { useState, Dispatch, SetStateAction } from "react";
import ReactDOM from "react-dom";

type Props = {
  open: boolean;
  heading: string;
  caution: string;
  action: string;
  toggle: Dispatch<SetStateAction<boolean>>;
};

const OTPModal: React.FC<Props> = ({
  open,
  heading,
  action,
  caution,
  toggle,
}) => {
  const [content, setContent] = useState("");
  const [load, setLoad] = useState(false);
  if (!open) return null;
  return ReactDOM.createPortal(
    <VStack
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0,0,0,.6)"
      zIndex={1000}
    >
      <Flex
        zIndex={1000}
        transform="translate(-50%,-50%)"
        bg="white"
        pos={"fixed"}
        top="50%"
        left="50%"
        flexDirection="column"
        rounded="md"
        width={["95%", "350px"]}
        minHeight={"250px"}
        padding={4}
        gap={3}
      >
        <Flex
          position="absolute"
          right={3}
          top={2}
          color="primary.700"
          onClick={() => toggle(false)}
          cursor="pointer"
        >
          <RiCloseCircleLine fontSize="1.8rem" />
        </Flex>
        <Flex
          direction={"column"}
          roundedTop="md"
          paddingBottom={0}
          fontWeight="bolder"
        >
          <Heading fontSize={"1.3rem"} my={3} color={"primary.700"}>
            {heading}
          </Heading>
          <Text color="gray.500" fontSize=".8rem">
            {action}
          </Text>
        </Flex>{" "}
        <Flex gap={4} justifyContent="center" direction="column">
          <FormControl isInvalid={false}>
            <Input
              type="number"
              autoFocus={true}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              outline="none"
              style={{ caretColor: "transparent" }}
              fontSize="1.5rem"
              letterSpacing={".5rem"}
              color="primary.900"
            />
            <FormErrorMessage
              bg="red.100"
              _before={{
                content: '""',
                padding: "1px",
                background: "red.500",

                marginRight: "5px",
                height: "20px",
              }}
              fontSize={".7rem"}
            >
              Check your code again
            </FormErrorMessage>
          </FormControl>
        </Flex>{" "}
        <Text color={"gray.500"} fontSize=".7rem">
          {" "}
          {caution}
        </Text>
        <Flex direction="column" color="white" gap={4} mt={2}>
          <Text color="gray.500" fontSize={".8rem"}>
            {"Didn't receive an SMS? "}
            <Text
              as={"span"}
              color="twitter.600"
              cursor={"pointer"}
              fontWeight="bolder"
            >
              Resend
            </Text>
          </Text>
          <Button
            bg="primary.700"
            size={"sm"}
            width="100%"
            onClick={() => {
              setLoad(true);
              setTimeout((e) => {
                setLoad(false);
              }, 3000);
            }}
            _hover={{
              background: "primary.700",
            }}
          >
            {load ? <Spinner speed={".8s"} variant="" /> : "Verify"}
          </Button>
        </Flex>
      </Flex>
    </VStack>,
    document.querySelector("#modal")!
  );
};
export default OTPModal;
