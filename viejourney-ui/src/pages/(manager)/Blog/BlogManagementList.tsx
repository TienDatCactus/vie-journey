"use client";

import {
  Add,
  CheckCircle,
  Download,
  FilterList,
  Flag,
  GridView,
  MenuBook,
  Schedule,
  Search,
  ViewList,
} from "@mui/icons-material";
import {
  Card,
  Checkbox,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Button,
} from "@mui/material";
import { useState } from "react";
import ManagerLayout from "../../../layouts/ManagerLayout";
import type { IBlogQuery } from "../../../utils/interfaces/blog";
import NewPostDialog from "./component/AddPopup";
import BlogPostRow from "./component/BlogPostRow";
import StatCard from "./component/Card";
import useBlog from "./component/Container/hook";

export default function BlogManagementList() {
  const { blogs, handleCreateBlog, handleDeleteBlog } = useBlog();

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [checked, setChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(15);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastModified");

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleAuthorFilterChange = (event: SelectChangeEvent) => {
    setAuthorFilter(event.target.value);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleNewPostSubmit = (postData: IBlogQuery) => {
    handleCreateBlog(postData);
    setIsNewPostDialogOpen(false);
  };

  return (
    <ManagerLayout>
      <div className=" mx-auto p-4 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-md">
              <MenuBook className="text-indigo-600" sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Blog Content Dashboard
              </h1>
              <p className="text-gray-500 text-sm">
                Manage and moderate travel blog posts
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Download sx={{ fontSize: 16 }} />
              <span>Export</span>
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
              onClick={() => setIsNewPostDialogOpen(true)}
            >
              <Add sx={{ fontSize: 16 }} />
              <span>New Post</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Posts"
            value="5"
            icon={<MenuBook className="text-blue-600" sx={{ fontSize: 20 }} />}
            color="bg-blue-50"
          />
          <StatCard
            title="Published"
            value="3"
            icon={
              <CheckCircle className="text-green-600" sx={{ fontSize: 20 }} />
            }
            color="bg-green-50"
          />
          <StatCard
            title="Pending Review"
            value="1"
            icon={<Schedule className="text-amber-600" sx={{ fontSize: 20 }} />}
            color="bg-amber-50"
          />
          <StatCard
            title="Flagged"
            value="2"
            icon={<Flag className="text-red-600" sx={{ fontSize: 20 }} />}
            color="bg-red-50"
          />
        </div>

        <Card className="mb-6 p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                sx={{ fontSize: 16 }}
              />
              <input
                type="text"
                placeholder="Search by title, author, tag, or status..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <FilterList className="text-gray-500" sx={{ fontSize: 16 }} />
                  <span className="text-gray-500 text-sm">Filters:</span>
                </div>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="flagged">Flagged</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="author-filter-label">Author</InputLabel>
                  <Select
                    labelId="author-filter-label"
                    value={authorFilter}
                    label="Author"
                    onChange={handleAuthorFilterChange}
                  >
                    <MenuItem value="all">All Authors</MenuItem>
                    <MenuItem value="sarah">Sarah Chen</MenuItem>
                    <MenuItem value="mike">Mike Rodriguez</MenuItem>
                    <MenuItem value="emma">Emma Thompson</MenuItem>
                  </Select>
                </FormControl>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <Switch
                    size="small"
                    color="primary"
                    checked={checked}
                    onChange={() => {
                      setChecked(!checked);
                    }}
                  />
                  Flagged only
                </label>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="sort-by-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={sortBy}
                    label="Sort By"
                    onChange={handleSortByChange}
                  >
                    <MenuItem value="lastModified">Last Modified</MenuItem>
                    <MenuItem value="datePublished">Date Published</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="flex justify-end">
                <div className="bg-gray-100 rounded-md p-1 flex">
                  <button
                    className={`px-3 py-1 rounded-md cursor-pointer ${
                      viewMode === "cards" ? "bg-white shadow-sm" : ""
                    }`}
                    onClick={() => setViewMode("cards")}
                  >
                    <GridView sx={{ fontSize: 16 }} />
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md cursor-pointer ${
                      viewMode === "table" ? "bg-white shadow-sm" : ""
                    }`}
                    onClick={() => setViewMode("table")}
                  >
                    <ViewList sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="overflow-x-auto border-gray-400 rounded-[10px]">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-300">
                <th className="pb-3 pr-4 font-medium">
                  <Checkbox size="small" />
                </th>
                <th className="pb-3 pr-4 font-medium">Title & Author</th>
                <th className="pb-3 pr-4 font-medium">Trip & Location</th>
                <th className="pb-3 pr-4 font-medium">Content</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Dates</th>
                <th className="pb-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs?.map((blog) => {
                return (
                  <BlogPostRow
                    key={blog._id}
                    blog={blog}
                    handleDeleteBlog={handleDeleteBlog}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
            to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems} posts
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 cursor-pointer ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous
              </span>
            </Button>

            {Array.from(
              { length: Math.ceil(totalItems / itemsPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </Button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(totalItems / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              className={`px-3 py-1 cursor-pointer ${
                currentPage === Math.ceil(totalItems / itemsPerPage)
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-1">
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <NewPostDialog
        open={isNewPostDialogOpen}
        onClose={() => setIsNewPostDialogOpen(false)}
        onSubmit={handleNewPostSubmit}
      />
    </ManagerLayout>
  );
}
