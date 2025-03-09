import PostCard from "./PostCard";

const PostsGrid = ({ posts, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts?.map((post) => (
        <PostCard
          key={post.product_id}
          post={post}
          isSelected={selected === post.product_id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default PostsGrid;
