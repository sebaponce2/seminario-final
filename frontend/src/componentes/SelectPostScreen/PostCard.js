import { OFFERED } from "../../constants/enums";

const PostCard = ({ post, isSelected, onSelect }) => {
  const isOffered = post.state === OFFERED;

  return (
    <div
      className={`${
        isOffered ? "bg-gray-300 opacity-50" : "bg-gray-100"
      } rounded-lg overflow-hidden shadow-md ${
        !isOffered &&
        "cursor-pointer hover:shadow-lg transition-shadow duration-300"
      } ${isSelected ? "ring-2 ring-black" : ""}`}
      onClick={() => !isOffered && onSelect(post.product_id)}
    >
      <img
        src={post?.images[0] || "/placeholder.svg"}
        alt={post?.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-black">{post?.title}</h3>
        {isOffered && (
          <span className="bg-gray-900 text-white text-sm py-1 px-2 rounded-full">
            Ofrecido para trueque
          </span>
        )}
      </div>
    </div>
  );
};

export default PostCard;
