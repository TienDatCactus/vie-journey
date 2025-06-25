import {
  Add,
  AddAPhoto,
  AddCard,
  AddLocation,
  Delete,
  MoreTime,
} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import useAutocomplete, {
  AutocompleteGetTagProps,
} from "@mui/material/useAutocomplete";
import React from "react";
const Root = styled("div")(({ theme }) => ({
  color: "rgba(0,0,0,0.85)",
  fontSize: "14px",
  ...theme.applyStyles("dark", {
    color: "rgba(255,255,255,0.65)",
  }),
}));

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")(({ theme }) => ({
  width: "300px",
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  borderRadius: "4px",
  padding: "1px",
  display: "flex",
  flexWrap: "wrap",
  ...theme.applyStyles("dark", {
    borderColor: "#434343",
    backgroundColor: "#141414",
  }),
  "&:hover": {
    borderColor: "#40a9ff",
    ...theme.applyStyles("dark", {
      borderColor: "#177ddc",
    }),
  },
  "&.focused": {
    borderColor: "#40a9ff",
    boxShadow: "0 0 0 2px rgb(24 144 255 / 0.2)",
    ...theme.applyStyles("dark", {
      borderColor: "#177ddc",
    }),
  },
  "& input": {
    backgroundColor: "#fff",
    color: "rgba(0,0,0,.85)",
    height: "30px",
    boxSizing: "border-box",
    padding: "4px 6px",
    width: "0",
    minWidth: "30px",
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
    ...theme.applyStyles("dark", {
      color: "rgba(255,255,255,0.65)",
      backgroundColor: "#141414",
    }),
  },
}));

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

const StyledTag = styled(Tag)<TagProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "24px",
  margin: "2px",
  lineHeight: "22px",
  backgroundColor: "#fafafa",
  border: `1px solid #e8e8e8`,
  borderRadius: "2px",
  boxSizing: "content-box",
  padding: "0 4px 0 10px",
  outline: 0,
  overflow: "hidden",
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "#303030",
  }),
  "&:focus": {
    borderColor: "#40a9ff",
    backgroundColor: "#e6f7ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#003b57",
      borderColor: "#177ddc",
    }),
  },
  "& span": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  "& svg": {
    fontSize: "12px",
    cursor: "pointer",
    padding: "4px",
  },
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: "300px",
  margin: "2px 0 0",
  padding: 0,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#fff",
  overflow: "auto",
  maxHeight: "250px",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)",
  zIndex: 1,
  ...theme.applyStyles("dark", {
    backgroundColor: "#141414",
  }),
  "& li": {
    padding: "5px 12px",
    display: "flex",
    "& span": {
      flexGrow: 1,
    },
    "& svg": {
      color: "transparent",
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: "#fafafa",
    fontWeight: 600,
    ...theme.applyStyles("dark", {
      backgroundColor: "#2b2b2b",
    }),
    "& svg": {
      color: "#1890ff",
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#e6f7ff",
    cursor: "pointer",
    ...theme.applyStyles("dark", {
      backgroundColor: "#003b57",
    }),
    "& svg": {
      color: "currentColor",
    },
  },
}));

function CustomAutocomplete() {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    defaultValue: [topTravelBlogTags[1]],
    multiple: true,
    options: topTravelBlogTags,
    getOptionLabel: (option) => option.title,
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>Tags</Label>
        <InputWrapper
          ref={setAnchorEl}
          className={`${focused ? "focused" : ""} w-full`}
        >
          {value.map((option: FilmOptionType, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <StyledTag key={key} {...tagProps} label={option.title} />;
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox className="z-10" {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} {...optionProps}>
                <span>{option.title}</span>
                <CheckIcon fontSize="small" />
              </li>
            );
          })}
        </Listbox>
      ) : null}
    </Root>
  );
}

interface FilmOptionType {
  title: string;
  year: number;
}

const topTravelBlogTags = [
  { title: "Adventure", year: 2020 },
  { title: "Travel Tips", year: 2021 },
  { title: "Food", year: 2022 },
  { title: "Nature", year: 2023 },
  { title: "Culture", year: 2024 },
  { title: "Photography", year: 2025 },
  { title: "History", year: 2026 },
  { title: "Lifestyle", year: 2027 },
  { title: "Wellness", year: 2028 },
  { title: "Technology", year: 2029 },
  { title: "Fashion", year: 2030 },
  { title: "Art", year: 2031 },
  { title: "Music", year: 2032 },
  { title: "Sports", year: 2033 },
  { title: "Education", year: 2034 },
  { title: "Finance", year: 2035 },
  { title: "Real Estate", year: 2036 },
  { title: "Automotive", year: 2037 },
  { title: "Home Improvement", year: 2038 },
  { title: "Gardening", year: 2039 },
  { title: "Pets", year: 2040 },
  { title: "Parenting", year: 2041 },
  { title: "Relationships", year: 2042 },
  { title: "Self-Care", year: 2043 },
  { title: "Mental Health", year: 2044 },
  { title: "Personal Development", year: 2045 },
  { title: "Productivity", year: 2046 },
  { title: "Sustainability", year: 2047 },
  { title: "Travel Photography", year: 2048 },
  { title: "Culinary Adventures", year: 2049 },
  { title: "Exploring Cities", year: 2050 },
  { title: "Hidden Gems", year: 2051 },
  { title: "Road Trips", year: 2052 },
  { title: "Cultural Experiences", year: 2053 },
  { title: "Wildlife Encounters", year: 2054 },
  { title: "Beach Escapes", year: 2055 },
  { title: "Mountain Adventures", year: 2056 },
  { title: "Urban Exploration", year: 2057 },
  { title: "Historical Sites", year: 2058 },
  { title: "Festivals and Events", year: 2059 },
  { title: "Local Cuisine", year: 2060 },
  { title: "Travel Gear", year: 2061 },
  { title: "Budget Travel", year: 2062 },
  { title: "Luxury Travel", year: 2063 },
  { title: "Solo Travel", year: 2064 },
  { title: "Family Travel", year: 2065 },
  { title: "Couples Travel", year: 2066 },
  { title: "Adventure Sports", year: 2067 },
  { title: "Eco-Tourism", year: 2068 },
  { title: "Volunteer Travel", year: 2069 },
  { title: "Travel Safety", year: 2070 },
  { title: "Packing Tips", year: 2071 },
  { title: "Travel Apps", year: 2072 },
  { title: "Travel Insurance", year: 2073 },
  { title: "Travel Blogs", year: 2074 },
  { title: "Travel Vlogs", year: 2075 },
  { title: "Travel Podcasts", year: 2076 },
];
const BlogCreateToolbar: React.FC = () => {
  return (
    <aside className="col-span-3 rounded-lg border border-neutral-300 bg-white shadow-md p-4 h-fit space-y-4">
      <div>
        <h1 className="font-semibold">Blog Sections</h1>
        <ul className="space-y-2 py-2">
          <li className="p-2 rounded-sm hover:bg-neutral-200 duration-200 transition-all cursor-pointer flex itemce justify-between">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className="text-sm"
            >
              <span className="text-green-500">&#x2022;</span>
              <p>Introduction</p>
            </Stack>
            <IconButton
              size="small"
              className="group hover:bg-red-500 transition-all duration-200"
            >
              <Delete className="size-5 group-hover:text-white" />
            </IconButton>
          </li>
        </ul>
        <Button startIcon={<Add />} className="w-full">
          Add Section
        </Button>
      </div>
      <Divider />
      <div>
        <h1 className="font-semibold">Current Settings</h1>
        <Stack direction="column" spacing={2} className="py-2">
          <TextField label="Title" variant="outlined" size="small" fullWidth />
          <TextField
            label="Description"
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={4}
          />
          <CustomAutocomplete />

          <TextField
            label="Slug"
            variant="outlined"
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <span className="bg-gray-300 text-gray-500">/blogs/</span>
                ),
              },
            }}
          />
        </Stack>
      </div>
      <Divider />
      <div>
        <h1 className="font-semibold">Blog info</h1>
        <dl className="py-2 space-y-2">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Status</dt>
            <dd>
              <Chip
                size="small"
                className="bg-green-500 text-white"
                label="Draft"
              />
            </dd>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Created at</dt>
            <dd className="text-sm text-gray-500">12 minutes ago</dd>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Last saved</dt>
            <dd className="text-sm text-gray-500">9 minutes ago</dd>
          </Stack>
        </dl>
      </div>
    </aside>
  );
};

export default BlogCreateToolbar;
