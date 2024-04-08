import {
  Box,
  Center,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
  HStack,
  Select,
  Switch,
  Button,
  Stack,
} from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { useFetchSolarImagery } from "./api/client";
import DateTimePicker from "react-datetime-picker";
import { MdClear } from "react-icons/md";
import { LuCalendar } from "react-icons/lu";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./styles.css";

interface SunpageProps {}

async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

const Sunpage: FunctionComponent<SunpageProps> = () => {
  const wavelengths = ["0193", "0304", "0171", "0211", "HMIB", "HMID"];

  const [imageData, setImageData] = useState({
    imgUrl: "",
    createdAt: "",
    type: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    date: new Date(),
    type: "original",
    wavelength: "0193",
  });

  const { mutateAsync, isPending } = useFetchSolarImagery();

  useEffect(() => {
    mutateAsync(filterOptions).then((response) => {
      setImageData(response.data);
    });
  }, []);

  return (
    <Center w={"95vw"} minH={"100vh"} py={"4rem"}>
      <VStack w={"70%"} minW={"800px"} maxW={"100%"}>
        <Box position={"relative"}>
          <Heading>Solar Activity Tracker</Heading>
          <Flex alignItems={"center"}>
            <Text fontSize={"0.875rem"}>
              Sponsored by NASA's Solar Dynamics Observatory!
            </Text>
            <Image
              h={"2rem"}
              ml={"1rem"}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/2449px-NASA_logo.svg.png"
              }
            />
          </Flex>
        </Box>

        <Flex border={"1px solid rgba(255, 255, 255, 0.3)"}>
          <Image src={imageData.imgUrl} h={"600px"} />
          <Stack px={"4rem"} py={"2rem"} pl={"2rem"}>
            <Heading fontSize={"1.5rem"} fontWeight={300} textAlign={"start"}>
              {" "}
              Image Data
            </Heading>
            <Text>
              Created at:{" "}
              <b>{new Date(imageData.createdAt).toLocaleString("en-GB")}</b>
            </Text>
            <Text>
              Wavelength: <b>{filterOptions.wavelength}</b>
            </Text>
            <Text>
              Type: <b>{imageData.type}</b>
            </Text>

            <Button
              alignSelf={"flex-end"}
              w={"100%"}
              onClick={() => {
                downloadImage(
                  imageData.imgUrl,
                  filterOptions.wavelength + ".jpg"
                );
              }}
            >
              Download Image
            </Button>
          </Stack>
        </Flex>

        <HStack
          p={"1.5rem"}
          border={"1px solid rgba(255, 255, 255, 0.3)"}
          borderRadius={"1rem"}
          gap={"2rem"}
        >
          <Box>
            <Text fontSize={"0.875rem"} opacity={0.5}>
              Wavelength
            </Text>
            <Select
              value={filterOptions.wavelength}
              onChange={(e) => {
                setFilterOptions({
                  ...filterOptions,
                  wavelength: e.target.value,
                });
              }}
            >
              {wavelengths.map((e) => {
                return <option value={e}>{e}</option>;
              })}
            </Select>
          </Box>

          <Box>
            <Text fontSize={"0.875rem"} opacity={0.5}>
              Date
            </Text>

            <Box
              borderRadius={"6px"}
              border={"1px solid rgba(255, 255, 255, 0.2)"}
              p={"0.35rem"}
            >
              <DateTimePicker
                value={filterOptions.date}
                calendarClassName={"bazingen"}
                clearIcon={() => <MdClear color={"white"} />}
                calendarIcon={() => <LuCalendar color={"white"} />}
                className={"externalContainerName"}
                onChange={(value) => {
                  if (value) {
                    setFilterOptions({
                      ...filterOptions,
                      date: value,
                    });
                  }
                }}
              />
            </Box>
          </Box>

          <Box>
            <Text fontSize={"0.875rem"} opacity={0.5}>
              Apply activity highlights
            </Text>
            <Switch
              isChecked={filterOptions.type === "transformed"}
              size={"md"}
              onChange={() => {
                setFilterOptions({
                  ...filterOptions,
                  type:
                    filterOptions.type === "transformed"
                      ? "original"
                      : "transformed",
                });
              }}
            />
          </Box>

          <Button
            ml={"2rem"}
            onClick={() => {
              mutateAsync(filterOptions).then((response) => {
                setImageData(response.data);
              });
            }}
            isLoading={isPending}
            colorScheme="yellow"
          >
            Retrieve Solar Imagery Data
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Sunpage;
