"use client";

import type React from "react";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import useAutocomplete, {
  type AutocompleteGetTagProps,
} from "@mui/material/useAutocomplete";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { IBlog } from "../../../utils/interfaces/blog";

interface FilmOptionType {
  title: string;
  year: number;
}

// Your existing styled components
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
  border: "1px solid #e8e8e8",
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
];

function CustomAutocomplete({
  tags,
  onTagsChange,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const selectedValues = topTravelBlogTags.filter((tag) =>
    tags?.includes(tag.title)
  );

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
    defaultValue: selectedValues,
    multiple: true,
    options: topTravelBlogTags,
    getOptionLabel: (option) => option.title,
    onChange: (_, newValue) => {
      const newTags = newValue.map((option) => option.title);
      onTagsChange(newTags);
    },
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
      {groupedOptions.length > 0 && (
        <Listbox className="z-10" {...getListboxProps()}>
          {(groupedOptions as FilmOptionType[]).map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} {...optionProps}>
                <span>{option.title}</span>
                <CheckIcon fontSize="small" />
              </li>
            );
          })}
        </Listbox>
      )}
    </Root>
  );
}

// New ImageUpload component
function ImageUpload({
  coverImage,
  coverImageUrl,
  onImageChange,
}: {
  coverImage: File | null;
  coverImageUrl: string | null;
  onImageChange: (file: File | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(coverImageUrl);

  useEffect(() => {
    setPreviewUrl(coverImageUrl);
  }, [coverImageUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      onImageChange(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Label>Cover Image</Label>
      {previewUrl ? (
        <Box sx={{ mt: 1 }}>
          <Box
            sx={{
              position: "relative",
              "&:hover .delete-overlay": {
                opacity: 1,
              },
            }}
          >
            <Box
              component="img"
              src={previewUrl}
              alt="Cover preview"
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid #d9d9d9",
              }}
            />
            <Box
              className="delete-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s",
                borderRadius: 1,
              }}
            >
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,1)",
                  },
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>{coverImage?.name}</strong>
            <br />
            {coverImage
              ? `${(coverImage?.size / 1024 / 1024).toFixed(2)} MB`
              : ""}
          </Typography>
        </Box>
      ) : (
        <Box
          onClick={handleUploadClick}
          sx={{
            mt: 1,
            border: "2px dashed #d9d9d9",
            borderRadius: 1,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#40a9ff",
              backgroundColor: "#fafafa",
            },
            transition: "all 0.2s",
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: "#d9d9d9", mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Click to upload cover image
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG, GIF up to 5MB
          </Typography>
        </Box>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </Box>
  );
}

const BlogCreateToolbar = ({
  blog,
  formData,
  onFormDataChange,
  coverImageUrl,
  setCoverImageUrl,
}: {
  blog: IBlog | null;
  formData: {
    title: string;
    summary: string;
    slug: string;
    tags: string[];
    coverImage: File | null;
  };
  onFormDataChange: (field: string, value: any) => void;
  coverImageUrl: string | null;
  setCoverImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <aside className="col-span-3  border border-neutral-300 bg-white shadow-md p-4 h-fit space-y-4">
      <div>
        <h1 className="font-semibold">Current Settings</h1>
        <Stack direction="column" spacing={2} className="py-2">
          <Label>Title</Label>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={formData.title}
            onChange={(e) => onFormDataChange("title", e.target.value)}
          />

          <Label>Summary</Label>
          <TextField
            variant="outlined"
            size="medium"
            fullWidth
            multiline
            rows={3}
            value={formData.summary}
            onChange={(e) => onFormDataChange("summary", e.target.value)}
          />

          <CustomAutocomplete
            tags={formData.tags}
            onTagsChange={(tags) => onFormDataChange("tags", tags)}
          />

          <ImageUpload
            coverImage={formData.coverImage}
            coverImageUrl={coverImageUrl}
            onImageChange={(file) => {
              onFormDataChange("coverImage", file);
              if (file) {
                const objectUrl = URL.createObjectURL(file);
                setCoverImageUrl(objectUrl);
              } else {
                setCoverImageUrl(null);
              }
            }}
          />

          <TextField
            label="Slug"
            variant="outlined"
            size="small"
            value={formData.slug}
            onChange={(e) => onFormDataChange("slug", e.target.value)}
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
                label={blog?.status}
              />
            </dd>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Created at</dt>
            <dd className="text-sm text-gray-500">
              {dayjs(blog?.createdAt).format("YYYY-MM-DD HH:mm")}
            </dd>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Last saved</dt>
            <dd className="text-sm text-gray-500">
              {dayjs(blog?.updatedAt).format("YYYY-MM-DD HH:mm")}
            </dd>
          </Stack>
        </dl>
      </div>
    </aside>
  );
};

export default BlogCreateToolbar;
