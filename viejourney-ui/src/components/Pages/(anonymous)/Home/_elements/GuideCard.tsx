import {
  Badge,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
} from "@mui/material";
import React from "react";
interface GuideCardProps {
  title: string;
  tags: string[];
  mins: number;
  img: string;
}

const GuideCard = ({ title, tags, mins, img }: GuideCardProps) => {
  return (
    <Card className="pb-10" elevation={0}>
      <Badge
        badgeContent={`${mins} minutes read`}
        className="[&_.MuiBadge-badge]:bg-gray-400/10 [&_.MuiBadge-badge]:bg-clip-padding [&_.MuiBadge-badge]:backdrop-filter [&_.MuiBadge-badge]:backdrop-blur-sm [&_.MuiBadge-badge]:bg-opacity-50 [&_.MuiBadge-badge]:border [&_.MuiBadge-badge]:border-gray-100 [&_.MuiBadge-badge]:right-16 [&_.MuiBadge-badge]:p-3 [&_.MuiBadge-badge]:rounded-lg"
        overlap="circular"
      >
        <CardMedia component={"img"} alt={title} image={img} className="" />
      </Badge>
      <CardContent className="py-0">
        <h1 className="my-0 text-[30px]">{title}</h1>
        <Stack direction="row" spacing={1}>
          {tags.map((tag, index) => (
            <Chip label={tag} key={index} className="font-normal" clickable />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GuideCard;
