import { SUPER_ADMIN } from "../../constants/enums";

const PostHeader = ({ postDescription, auth }) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{postDescription?.title}</h1>

      <div className="flex items-center mb-4">
        <img
          src={
            postDescription?.post_creator?.profile_picture || "/placeholder.svg"
          }
          alt={`${postDescription?.post_creator?.name} ${postDescription?.post_creator?.last_name}`}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <p className="font-semibold">{`${postDescription?.post_creator?.name} ${postDescription?.post_creator?.last_name}`}</p>
          <p className="text-gray-600">{postDescription?.location}</p>
        </div>
      </div>

      {auth?.role === SUPER_ADMIN && (
        <div className="mb-4">
          <span
            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
              postDescription?.type === "Bien"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {postDescription?.type}
          </span>
        </div>
      )}
    </>
  );
};

export default PostHeader;
