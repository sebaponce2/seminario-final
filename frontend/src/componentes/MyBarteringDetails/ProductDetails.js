import React from "react";

const ProductDetails = ({ title, image, heading }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-center text-black">{heading}</h2>
    <img src={image} alt={title} className="w-40 h-40 object-cover rounded-lg mx-auto" />
    <p className="text-md text-black text-center">{title}</p>
  </div>
);

export default ProductDetails;