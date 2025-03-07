import React from "react";

export const Input = ({
  formData,
  handleChange,
  errors,
  name,
  label,
  type = "text",
  placeholder,
  isOptional = false,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-black">
        {label}{" "}
        {isOptional && <span className="text-gray-500">(Opcional)</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`mt-1 block w-full px-3 py-2 bg-white border ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-black focus:ring-1 focus:ring-black`}
        required={!isOptional}
        aria-invalid={errors[name] ? "true" : "false"}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500" id={`${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );
};
