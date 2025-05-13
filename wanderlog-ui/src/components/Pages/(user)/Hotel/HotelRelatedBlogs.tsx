import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import EastSharpIcon from "@mui/icons-material/EastSharp";
import { color } from "motion/react";
const HotelRelatedBlogs: React.FC = () => {
  const fakeData = [
    {
      title: "New facilities : Large golf course at the Zerra hotel",
      date: "25 May 2023",
    },
    {
      title: "Coming soon! a posh supermarket near the hotel",
      date: "12 May 2023",
    },
    {
      title: "Webinar event Mental training for young people to develop",
      date: "14 Apr 2023",
    },
  ];
  return (
    <div className="bg-[#fafafa] w-full h-full py-20">
      <Container>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <h1 className="text-[#141414] font-medium text-[2.5rem]">Blog</h1>
          <Button
            endIcon={<EastSharpIcon />}
            className="bg-transparent text-[#616161] p-0 hover:underline"
          >
            View more
          </Button>
        </Stack>
        <Divider className="border my-4" />
        <Grid2 container spacing={2}>
          {!!fakeData?.length &&
            fakeData?.map((data, index) => {
              return (
                <Grid2 size={4} key={index}>
                  <Card
                    className="shadow-none bg-[#fafafa]"
                    sx={{ maxWidth: 345 }}
                  >
                    <CardActionArea className="p-2">
                      <CardMedia
                        component="img"
                        height="120"
                        className="rounded-sm"
                        image={`https://placehold.co/600x400/1a1a1a/ffffff?text=${data?.title
                          .split(" ")[0]
                          .concat("+")
                          .concat(data?.title.split(" ")[1])}`}
                        alt={data?.title}
                      />
                      <CardContent className="p-0">
                        <Typography
                          variant="h5"
                          className="text-[1.125rem] font-medium my-4"
                          component="div"
                        >
                          {data?.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="font-medium"
                          sx={{ color: "text.secondary" }}
                        >
                          {data?.date}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid2>
              );
            })}
        </Grid2>
      </Container>
    </div>
  );
};

export default HotelRelatedBlogs;
