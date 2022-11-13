import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { clientPost } from "../../../Commons";

type fineCategorySchema = {
  amount: number;
  fineName: string;
};
const FineCategoryAdditionModal = (props: any) => {
  const { onClose, authToken } = props;
  const [fineCategory, setFineCategory] = useState({
    amount: 0,
    fineName: "",
  });

  const addFineCategory = async (fineCategory: fineCategorySchema) => {
    const request = await clientPost({
      token: authToken,
      data: fineCategory,
      method: "POST",
      url: "fine-category/add",
    });
    if (request == 200) {
      console.log("success");
    } else {
      console.log("Failed");
    }
  };
  return (
    <>
      <ModalHeader fontSize={"normal"} pl={4} bg="twitter.500" color="white">
        New Fine Category
      </ModalHeader>
      <ModalCloseButton color="white" />
      <ModalBody>
        <VStack>
          <FormControl>
            <FormLabel>Fine Name</FormLabel>
            <Input
              type={"text"}
              max={"30"}
              value={fineCategory.fineName}
              onChange={(e) =>
                setFineCategory({ ...fineCategory, fineName: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Input
              min={20}
              max={100}
              type="number"
              value={fineCategory.amount}
              onChange={(e) =>
                setFineCategory({
                  ...fineCategory,
                  amount: parseFloat(e.target.value),
                })
              }
            />
          </FormControl>
        </VStack>
      </ModalBody>

      <ModalFooter gap={3}>
        <Button variant="ghost" colorScheme="red" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          mr={3}
          onClick={async () => {
            await addFineCategory(fineCategory);
            onClose();
          }}
        >
          Add
        </Button>
      </ModalFooter>
    </>
  );
};
export default FineCategoryAdditionModal;
