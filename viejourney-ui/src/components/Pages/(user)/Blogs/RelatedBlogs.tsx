import { Card, CardContent, Alert } from "@mui/material";
import React from "react";
import CardSkeleton from "../../../../utils/handlers/loading/CardSkeleton";
import { useBlogStore } from "../../../../services/stores/useBlogStore";
const RelatedBlogs: React.FC = () => {
  const { relatedBlogs } = useBlogStore();
  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        Related Blogs
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!!relatedBlogs &&
          relatedBlogs.length > 0 &&
          relatedBlogs.map((article, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48">
                <img
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  className="object-cover group-hover:scale-105 w-full h-48 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {article.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    by{" "}
                    {article.createdBy?.fullName ||
                      article.createdBy?.userId?.email}
                  </span>
                  <span>8 mins read</span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {relatedBlogs.length === 0 && (
        <div className="relative w-full  flex flex-col justify-center items-center">
          <div className="inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute  w-full h-full flex justify-center items-center ">
            <Alert severity="error" className=" text-center">
              No blogs currently available
            </Alert>
          </div>
          <div className="w-full max-w-[75rem] mx-auto flex justify-center items-center">
            <CardSkeleton count={3} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedBlogs;
