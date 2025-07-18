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
  Button,
  Card,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import ManagerLayout from "../../../layouts/ManagerLayout";
import type { IBlogQuery } from "../../../utils/interfaces/blog";
import NewPostDialog from "./component/AddPopup";
import BlogPostRow from "./component/BlogPostRow";
import StatCard from "./component/Card";
import useBlog from "./component/Container/hook";

export default function BlogManagementList() {
  const {
    blogs,
    handleCreateBlog,
    handleDeleteBlog,
    totalPage,
    params,
    totalBlog,
    handleChangePage,
    handleSearchChange,
    handleChangeStatus,
    handleSort
  } = useBlog();

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);


  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    handleChangeStatus(event.target.value);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    handleSort(event.target.value);
  };

  const handleNewPostSubmit = (postData: IBlogQuery) => {
    handleCreateBlog(postData);
    setIsNewPostDialogOpen(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearchChange(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
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
            value={totalBlog + ""}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
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
                    value={params.status}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="sort-by-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={params.sort}
                    label="Sort By"
                    onChange={handleSortByChange}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                   
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

        <div className="flex items-center justify-around mt-4 px-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {Math.min((params.page - 1) * params.pageSize + 1, totalBlog ?? 0)}{" "}
            to {Math.min(params.page * params.pageSize, totalBlog ?? 0)} of{" "}
            {totalBlog} posts
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleChangePage(params.page - 1)}
              disabled={params.page === 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPage ?? 1 }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  onClick={() => handleChangePage(page)}
                  variant={page === params.page ? "contained" : "text"}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              onClick={() => handleChangePage(params.page + 1)}
              disabled={params.page === totalPage}
            >
              Next
            </Button>
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
