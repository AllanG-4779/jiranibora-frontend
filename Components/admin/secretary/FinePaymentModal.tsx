import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

const FinePaymentModal = (props: any) => {
  const { resolveFine, onClose, fineToResolve, authToken } = props;
  return (
    <>
      <ModalHeader fontSize={"normal"} pl={4} bg="red.500" color="white">
        Confirm Manual Payment
      </ModalHeader>
      <ModalCloseButton color="white" />
      <ModalBody>
        <Text color="black" fontSize={".9rem"}>
          By completing this action, you acknowledge that you have received the
          funds in Cash
        </Text>
      </ModalBody>

      <ModalFooter gap={3}>
        <Button variant="ghost" colorScheme="red" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          mr={3}
          onClick={() => resolveFine(fineToResolve, authToken)}
        >
          Yes, I do
        </Button>
      </ModalFooter>
    </>
  );
};
export default FinePaymentModal;
