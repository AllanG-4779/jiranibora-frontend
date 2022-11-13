import {
  Text,
  Flex,
  Box,
  FormControl,
  Input,
  FormLabel,
  RadioGroup,
  Radio,
  HStack,
  Select,
  Button,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { loanApplication, sessionType } from "../../types";
import { clientPost } from "../../../Commons";
import AlertBox from "../Signup/Alert";

const ApplyLoan = () => {
  const [calc, setCalc] = useState({ amount: 0, rate: 20, duration: 1 });
  const [ownership, setOwner] = useState("1");
  const [showable, setShowable] = useState("");
  const { data: session, status } = useSession();
  const localSession = session as sessionType;
  // this is used to toggle the guarantees data
  const show = setTimeout(
    () => (ownership === "1" ? setShowable("none") : setShowable("flex")),
    1000
  );

  // loan calc
  const [loanData, setLoanData] = useState({
    amount: 0,
    owner: ownership,
    duration: 1,
    name: "",
    id: "",
  });
  // for input alert
  const [message, setMessage] = useState("");
  const [size, setSize] = useState(-100);
  const [repayable, setRepayable] = useState(0);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  // submit loan application
  if (status == "unauthenticated") {
    return (
      <div>
        <h2>Authentication is required to apply loan</h2>
      </div>
    );
  }

  const submitLoan = async () => {
    if (loanData.amount < 500) {
      setMessage("Amount must be greater than KES 500");
      console.log(loanData);
      setType("error");
      setSize(0.1);
      return;
    }
    if (loanData.duration < 1) {
      setMessage("Duration should be at least 1 month");
      setType("error");
      setSize(20);
      return;
    }
    if (parseInt(ownership) === 0) {
      if (loanData.name.length < 1 || loanData.id.length < 1) {
        setMessage(
          "Both national Id and full names of the applicant is required"
        );
        setType("error");
        setSize(0.1);
        return;
      }
    }
    // check for authentications;

    // After doing the validations now post the data
    const postData = {
      ...loanData,
      owner: loanData.owner == "1" ? true : false,
    };
    const params = {
      data: postData,
      method:"POST",
      url: "loan/apply",
      token: localSession.user.access_token,
    };
    setLoading(true);
    const status = await clientPost(params);
    setLoading(false);
    // feedback
    if (status === 201) {
      setType("success");
      setSize(0.1);
      setMessage("Your loan was submitted successfuly");
    }
    if (status ===409 ) {
      setType("error");
      setSize(0.1);
      setMessage("Server failed to process your request due to unknown error");
    }
    if ( status===403) {
      setType("error");
      setSize(0.1);
      setMessage(`You have an outstanding loan pending payment`);
    }
    setTimeout(() => setSize(-100), 10000);
  };

  return (
    <>
      <Flex direction="column" mt={5} p={4}>
        <Text fontSize="normal">
          Hi, <span style={{ fontWeight: "bolder" }}>Allan. </span>Submit a loan
          Request{" "}
        </Text>
        <Flex
          bg="white"
          width={["100%", "100%", "95%"]}
          mx={"auto"}
          p={5}
          mt={8}
          rounded="md"
          gap={5}
          direction={["column", "column", "row"]}
        >
          <Box display={"flex"} flexDirection="column" gap={4} flex={2}>
            <FormControl>
              <FormLabel>How much do you need</FormLabel>
              <Input
                placeholder="amount"
                type="number"
                value={loanData.amount}
                onChange={(e) =>
                  setLoanData({ ...loanData, amount: parseInt(e.target.value) })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Is the loan yours?</FormLabel>
              <RadioGroup
                name="wonership"
                value={ownership}
                onChange={setOwner}
              >
                <HStack gap={4}>
                  <Radio value={"1"}>Yes</Radio>
                  <Radio value={"0"}>No</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            {/* The applicant */}
            <Box
              display={showable}
              opacity={ownership == "1" ? 0 : 1}
              flexDirection="column"
              transition="all 1s ease-in-out"
              gap={4}
            >
              <FormControl>
                <Input
                  placeholder="Applicant's full name"
                  value={loanData.name}
                  onChange={(e) =>
                    setLoanData({
                      ...loanData,
                      name: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <Input
                  type={"number"}
                  placeholder="Valid National ID number"
                  value={loanData.id}
                  onChange={(e) =>
                    setLoanData({
                      ...loanData,
                      id: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Box>
            <FormControl>
              <FormLabel>How long before you repay (months)</FormLabel>
              <Input
                placeholder="e.g. 2"
                type="number"
                value={loanData.duration}
                onChange={(e) =>
                  setLoanData({
                    ...loanData,
                    duration: parseInt(e.target.value),
                  })
                }
              />
            </FormControl>
            <FormControl>
              <Button
                colorScheme="blue"
                size={"sm"}
                width="100%"
                onClick={submitLoan}
                disabled={loading ? true : false}
              >
                Submit
              </Button>
            </FormControl>
          </Box>
          <Box
            p={3}
            flex={1}
            flexDirection="column"
            display="flex"
            gap={3}
            mt={[10, 10, 0, 0]}
            bg="white"
            padding={4}
            rounded="md"
          >
            <Text>Loan Calculator</Text>
            <FormControl>
              <Input
                placeholder="Amount"
                type="number"
                onChange={(e) =>
                  setCalc({ ...calc, amount: parseInt(e.target.value) })
                }
                value={calc.amount}
                size="sm"
              />
            </FormControl>
            <FormControl>
              <Text>Ownership</Text>
              <Select
                size="sm"
                name="rate"
                value={calc.rate}
                onChange={(e) =>
                  setCalc({ ...calc, rate: parseInt(e.target.value) })
                }
              >
                <option value={20}>Self</option>
                <option value={30}>Guarator</option>
              </Select>
            </FormControl>
            <FormControl>
              <Input
                type="number"
                placeholder="Duration"
                size="sm"
                onChange={(e) =>
                  setCalc({ ...calc, duration: parseInt(e.target.value) })
                }
                value={calc.duration}
              />
            </FormControl>
            <FormControl>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() =>
                  setRepayable(
                    calc.amount +
                      (calc.amount * calc.duration * calc.rate) / 100
                  )
                }
              >
                Calculate
              </Button>
            </FormControl>
            <Text color="gray.400" fontSize="sm">
              You will repay {repayable}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <AlertBox size={size} setSize={setSize} type={type} message={message} />
    </>
  );
};
export default ApplyLoan;
