const PostDescriptionBox = ({ description }) => {
  return (
    <div className="mb-8 p-4 border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Descripción</h2>
      <p>{description}</p>
    </div>
  );
};

export default PostDescriptionBox;
