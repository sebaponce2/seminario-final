import React from "react";

const ProductGrid = ({ posts, navigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <article
          onClick={() => navigate("/detailsPost", { state: post.product_id })}
          key={index}
          className="bg-white rounded-lg overflow-hidden border-2 border-gray-100 bg-black cursor-pointer"
        >
          <img src={post?.images[0]} alt={post.title} className="w-full h-64 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-500 mb-1">{post.location}</p>
            <p className="text-gray-500">{post.category}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ProductGrid;
