import { ChevronDownIcon } from "lucide-react";
import { statusOptions } from "../../constants/labels";

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="block w-40 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
      >
        {statusOptions.map((option) => (
          <option key={option.status} value={option.status}>
            {option.text}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

export default StatusDropdown;
