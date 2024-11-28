import { ChevronLeft, ChevronRight } from "lucide-react";

export const CustomArrow = ({ onClick, direction }) => {
    const positionClass = direction === "left" ? "left-2" : "right-2";
  
    return (
      <div
        onClick={onClick}
        className={`absolute top-1/2 transform -translate-y-1/2 ${positionClass} 
          bg-black/60 rounded-full p-2 cursor-pointer z-10 
          flex items-center justify-center hover:bg-black/80 transition duration-300`}
        style={{
          width: "40px",
          height: "40px",
        }}
      >
        {direction === "left" ? (
          <ChevronLeft className="w-6 h-6 text-white" />
        ) : (
          <ChevronRight className="w-6 h-6 text-white" />
        )}
      </div>
    );
  };