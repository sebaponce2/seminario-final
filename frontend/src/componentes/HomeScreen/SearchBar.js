import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery, selectedProvince, setSelectedProvince, provinces }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar bien o servicio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>
      <select
        value={selectedProvince}
        onChange={(e) => setSelectedProvince(e.target.value)}
        className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
      >
        <option value="">Todas las provincias</option>
        {provinces.map((prov) => (
          <option key={prov.location_id} value={prov.name}>
            {prov.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
