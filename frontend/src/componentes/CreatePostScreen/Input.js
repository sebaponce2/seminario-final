import React from "react";

export const Input = ({ id, label, type = "text", value, onChange, maxLength }) => {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-black" htmlFor={id}>
        {label}
      </label>
      {type === "textarea" ? (
        <>
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            rows={4}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">{value.length}/{maxLength} caracteres</p>
        </>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      )}
    </div>
  );
};