import React from "react";

export const SelectDropdown = ({ id, label, options, value, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-black" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"
        required
      >
        <option key="" value="">
          Selecciona una opción
        </option>
        {options.map((option) => (
          <option
            key={option.category_id || option.location_id}
            value={option.category_id || option.location_id}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
