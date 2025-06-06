"use client";

export interface SimpleCardProps {
  imageSrc: string;
  title: string;
  size: string;
  onClick: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const Card = ({
  imageSrc,
  title,
  size,
  onClick,
  onUpdate,
  onDelete,
}: SimpleCardProps) => {
  return (
    <div className="w-full h-[340px] bg-white p-[10px] rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-shadow group">
      <div
        className="relative w-full h-[250px] rounded-[5px] overflow-hidden"
        onClick={onClick}
      >
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate?.();
              }}
              className="flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Cập nhật"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex items-center justify-center w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Xóa"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-[700] text-[20px]">{title}</h3>
        <p className="mt-[10px] text-[#a6acaf]">{size}</p>
      </div>
    </div>
  );
};

export default Card;
