import { Box } from "@chakra-ui/react";
import Layout from "../Components/Layout";
import Signup from "../Components/client/Signup/Signup";

const Register = () => {
  return (
    <Box >
      <Signup />
    </Box>
  );
};
Register.PageLayout = Layout;
export default Register;
