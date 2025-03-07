import React from "react";

const Input = ({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required
        className={`w-full px-3 py-2 border ${
          error && touched ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error && touched}
        aria-describedby={error && touched ? `${id}-error` : undefined}
      />
      {error && touched && (
        <p className="text-red-500 text-sm" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
