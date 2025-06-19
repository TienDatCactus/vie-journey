"use client";

import {
  Add,
  CheckCircle,
  Download,
  FilterList,
  Flag,
  GridView,
  MenuBook,
  Refresh,
  Schedule,
  Search,
  ViewList,
} from "@mui/icons-material";
import { Card, Checkbox, Switch } from "@mui/material";
import { useState } from "react";
import ManagerLayout from "../../../layouts/ManagerLayout";
import { PostData } from "../../../utils/interfaces/blog";
import NewPostDialog from "./component/AddPopup";
import BlogPostRow from "./component/BlogPostRow";
import StatCard from "./component/Card";

export default function Blog() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [checked, setChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(15);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);

  // const getCurrentItems = (items) => {
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //   return [];
  // };

  const handleNewPostSubmit = (postData: PostData) => {
    console.log("New post data:", postData);
    // Here you would typically send the data to your backend API
    // For now, we'll just log it to the console
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
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Refresh sx={{ fontSize: 16 }} />
              <span>Refresh</span>
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FilterList className="text-gray-500" sx={{ fontSize: 16 }} />
                  <span className="text-gray-500 text-sm">Filters:</span>
                </div>

                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Pending</option>
                  <option>Flagged</option>
                </select>

                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>All Authors</option>
                  <option>Sarah Chen</option>
                  <option>Mike Rodriguez</option>
                  <option>Emma Thompson</option>
                </select>

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
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Last Modified</option>
                  <option>Date Published</option>
                  <option>Title</option>
                  <option>Author</option>
                </select>
              </div>
              <div className="flex justify-end ">
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
                    className={`px-3 py-1 rounded-md  cursor-pointer ${
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

        <div className="overflow-x-auto  border-gray-400 rounded-[10px]">
          <table className="w-full  ">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-300">
                <th className="pb-3 pr-4 font-medium">
                  <Checkbox size="small" />
                </th>
                <th className="pb-3 pr-4 font-medium">Title & Author</th>
                <th className="pb-3 pr-4 font-medium">Trip & Location</th>
                <th className="pb-3 pr-4 font-medium">Content</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Performance</th>
                <th className="pb-3 pr-4 font-medium">Dates</th>
                <th className="pb-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <BlogPostRow
                title="Hidden Gems of Northern Vietnam: A Journey"
                author="Sarah Chen"
                trip="Vietnam Adventure 2024"
                location="Ta Xua, Vietnam"
                views={2847}
                comments={15}
                readTime={12}
                status="published"
                performance={12847}
                likes={45}
                modifiedDate="Mar 14, 2024"
                publishedDate="Mar 15, 2024"
                featured
              />
              <BlogPostRow
                title="Street Food Paradise: 48 Hours in Da Nang"
                author="Mike Rodriguez"
                trip="Central Vietnam Food Tour"
                location="Da Nang, Vietnam"
                views={1923}
                comments={22}
                readTime={8}
                status="pending"
                performance={0}
                likes={1}
                modifiedDate="Mar 13, 2024"
                publishedDate=""
                flagged
              />
              <BlogPostRow
                title="Sustainable Travel: Eco-Friendly Adventures in..."
                author="Emma Thompson"
                trip="Eco Sapa Experience"
                location="Sapa, Vietnam"
                views={3156}
                comments={18}
                readTime={14}
                status="published"
                performance={8934}
                likes={32}
                modifiedDate="Mar 11, 2024"
                publishedDate="Mar 12, 2024"
              />
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
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 cursor-pointer  ${
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
            </button>

            {Array.from(
              { length: Math.ceil(totalItems / itemsPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(totalItems / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              className={`px-3 py-1 cursor-pointer  ${
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
