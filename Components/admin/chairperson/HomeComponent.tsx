import { Avatar, Badge, Box, Flex, Text } from "@chakra-ui/react";
import { BiBlock, BiNews } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import MyCard from "./Misc";
import { MdPending } from "react-icons/md";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { db_application } from "../../types";
import { useRouter } from "next/router";

const HomeComponent = (props: any) => {
  // The Chart
  const totalRequired = 30;
  const router = useRouter();
  let users: db_application[] = [];

  if (props.status === false) {
    return <Text>Something went wrong or access is denied</Text>;
  } else {
    users = props.users;
  }

  const admitted = users!.filter((user?) => user.status === "Approved").length;
  const percentage = Math.ceil((admitted / totalRequired) * 100);
  // filter only the new applications
  const recent = users.filter((each) => each.actedUponAt === null).slice(0, 5);

  return (
    <>
      <Text fontWeight={"bolder"} color="#55585c" fontSize={"xl"} ml={5}>
        Dashboard
      </Text>

      <Flex width={["90vw", "95%"]} mx="auto" direction={["column"]} gap={4}>
        <Flex direction={["column", "column", "row"]} gap={4} flexWrap="wrap">
          <MyCard
            heading="New Applications"
            value={users!.filter((user) => user.viewed === false).length}
            Avatar={BiNews}
            color="success"
          />
          <MyCard
            heading="Declined"
            value={users!.filter((user) => user.status === "Declined").length}
            Avatar={BiBlock}
            color="red.300"
          />
          <MyCard
            heading="Pending"
            value={users!.filter((user) => user.status === "Pending").length}
            Avatar={MdPending}
            color="primary.900"
          />
          <MyCard
            heading="Approved "
            value={users!.filter((user) => user.status === "Approved").length}
            Avatar={TiTick}
            color="green.500"
          />
        </Flex>
        <Flex
          direction={["column", "column", "column", "row"]}
          width="100%"
          gap={4}
          mx="auto"
        >
          <Flex
            direction="column"
            shadow={"sm"}
            rounded="md"
            padding={4}
            // minH="fit-content"
            bg="white"
            flexGrow={2}
            position="relative"
            minW={"10rem"}
          >
            <Text fontWeight="bolder">Recent Applications</Text>
            {recent.length <= 0 ? (
              <Text
                textAlign={"center"}
                mt={38}
                color={"blue.500"}
                fontWeight="bold"
                bg="blue.100"
                width="80%"
                rounded="md"
                mx="auto"
              >
                New Applications will be shown here
              </Text>
            ) : (
              recent.map((each, key) => {
                return (
                  <Flex
                    direction="column"
                    mt={5}
                    key={key}
                    borderBottom="1px"
                    borderBottomColor={"gray.200"}
                    alignItems="flex-start"
                  >
                    <Flex
                      justifyContent={["flex-start"]}
                      mx={10}
                      width={"100%"}
                      gap={10}
                    >
                      <Flex gap={2} align={["center"]}>
                        <Avatar size="sm" />
                        <Flex direction="column">
                          <Text>
                            {each.firstName} {each.lastName}
                          </Text>
                          <Text fontSize=".8rem" color="gray.500" width="{80%}">
                            Applied on {each.createdAt.split("T")[0]} at{" "}
                            {each.createdAt.split("T")[1].split(".")[0]}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex
                        direction="column"
                        display={["none", "flex"]}
                        alignItems={"baseline"}
                        ml={3}
                      >
                        <Text fontSize={".9rem"}> {each.emailAddress}</Text>
                        <Text color="gray.500" fontSize={".8rem"}>
                          {each.phoneNumber}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                );
              })
            )}
            <Badge
              display={recent.length > 0 ? "flex" : "none"}
              position="absolute"
              right="2"
              bottom="2"
              colorScheme="green"
              cursor="pointer"
              size={"lg"}
              width="6rem"
              textAlign="center"
              onClick={() => router.push("/admin/chair/applications")}
            >
              See all
            </Badge>
          </Flex>
          <Flex
            direction={"column"}
            bg="white"
            shadow="sm"
            rounded="md"
            flexGrow={1}
            minWidth={300}
            p={3}
          >
            <Text fontWeight={"bolder"} mb={4}>
              Progress
            </Text>
            {/* <Box display="flex" flexDir={"row"}>
              <Avatar fontSize={""} />
              <Text>Allan Onyango</Text>
            </Box> */}
            <Flex
              id="insights-content"
              direction={"column"}
              alignItems="center"
              justifyContent={"center"}
              flexGrow={1}
            >
              <Box
                width={"100%"}
                display="flex"
                flexDirection={"column"}
                mx={"auto"}
                alignItems="center"
              >
                <Box width={200}>
                  <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    counterClockwise
                  />
                </Box>{" "}
                <Text my={2}>
                  <Badge as="span" colorScheme="green">
                    {" "}
                    {admitted}
                  </Badge>{" "}
                  of{" "}
                  <Badge as="span" colorScheme="blue">
                    {totalRequired}
                  </Badge>{" "}
                  Admitted
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Card container */}
      {/* <Flex
        flexWrap={"wrap"}
        direction={["column", "column", "row"]}
        gap={4}
        mx={"auto"}
        mt={4}
      >
       
        <MyCard heading="Declined" value={3} Avatar={BiBlock} color="red.300" />
      
      
      </Flex>
      {/* Recent actions */}
      {/* <Flex
        gap={4}
        mt={4}
        direction={["column", "column", "row"]}
        width={["90vw", "50rem"]}
        mx="auto"
      >
        <Flex direction={"column"} bg="white" shadow={"md"} flexGrow={3}>
          <Text fontSize={"1rem"} fontWeight="bolder">
            Recent Applications
          </Text>
        </Flex>
        <Flex
          direction={"column"}
          height={"4rem"}
          bg="white"
          shadow={"md"}
          flexGrow={1}
        >
          <Text fontSize={"1rem"} fontWeight="bolder"> */}
      {/* Recent Applications
          </Text>
        </Flex> */}
      {/* </Flex> */}
    </>
  );
};
export default HomeComponent;

// <Flex bg="green" direction={["column", "column", "row"]} gap={3}>
//   <Flex bg="yellow" direction={"column"}>
//     <Flex
//       m={6}
//       flexGrow={2}
//       gap={6}
//       direction={["column", "column", "row"]}
//       flexWrap="wrap"
//     >
//       <MyCard
//         heading="Active Members"
//         value={45}
//         Avatar={FaUser}
//         color="success"
//       />
//
//       {/* <MyCard />
//   <MyCard />
//   <MyCard /> */}
//     </Flex>
//     <Flex>
//       <Heading>Insights</Heading>
//     </Flex>
//   </Flex>
//   <Flex bg="red" flexGrow={1}>
//     <Heading>Recent Transaction</Heading>
//   </Flex>
// </Flex>; */}
