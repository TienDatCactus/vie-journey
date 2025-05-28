import React from "react";
import TextField from "@mui/material/TextField";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const Comment = () => {
  return (
    <div>
      <div className="comment mt-15 flex gap-5">
        <img
          src="https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_1280.png"
          alt="avatar-image"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="relative w-full">
          <TextField
            placeholder="Ask a question or share your thoughts"
            className="w-full"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "9999px",
                paddingRight: "80px",
                "& fieldset": {
                  borderColor: "#e5e7eb",
                },
                "&:hover fieldset": {
                  borderColor: "#d1d5db",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 16px",
              },
            }}
          />
          <button className="absolute font-bold cursor-pointer right-2 top-1/2 transform -translate-y-1/2  text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium hover:text-blue-900 transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Comment Thread */}
      <div className="comments-block mt-15 flex gap-5">
        <img
          src="https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_1280.png"
          alt="avatar-image"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="px-3">
          <div className="flex gap-2">
            <p className="text-[14px] font-bold">John Doe</p>
            <span className="text-gray-600 text-[14px]">2 months ago</span>
          </div>
          <div className="text-[14px] font-[400]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quos.
          </div>
          <div className="text-[14px] font-[600] flex items-center gap-1 py-3">
            <div className="flex items-center gap-1">
              <ThumbUpOffAltIcon className="text-gray-600 text-[19px] cursor-pointer" />
              <span className="text-gray-600 font-[600] min-w-[30px]">100</span>
            </div>
            <p className="font-bold ml-3 cursor-pointer">Reply</p>
          </div>
        </div>
      </div>

      {/* Reply Comment */}
      <div className="reply-comment ml-15 mt-3 flex gap-5">
        <img
          src="https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_1280.png"
          alt="avatar-image"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="px-3">
          <div className="flex gap-2">
            <p className="text-[14px] font-bold">Jane Smith</p>
            <span className="text-gray-600 text-[14px]">1 month ago</span>
          </div>
          <div className="text-[14px] font-[400]">
            Thanks for sharing! This is really helpful information. Thanks for
            sharing! This is really helpful information.Thanks for sharing! This
            is really helpful information.Thanks for sharing! This is really
            helpful information.
          </div>
          <div className="text-[14px] font-[600] flex items-center gap-1 py-3">
            <div className="flex items-center gap-1">
              <ThumbUpOffAltIcon className="text-gray-600 text-[19px] cursor-pointer" />
              <span className="text-gray-600 font-[600] min-w-[30px]">25</span>
            </div>
            <p className="font-bold ml-3 cursor-pointer">Reply</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
