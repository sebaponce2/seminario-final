import React from "react";

const Sidebar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <aside className="w-full md:w-64">
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <nav>
        <ul className="mb-3">
          <li key="">
            <a
              href="#"
              onClick={() => setSelectedCategory("")}
              className={`${selectedCategory === "" ? "text-black font-bold" : "text-gray-600 font-medium"} hover:text-gray-900 transition-colors`}
            >
              Todas las categorías
            </a>
          </li>
        </ul>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.category_id}>
              <a
                href="#"
                onClick={() => setSelectedCategory(category.name)}
                className={`${selectedCategory === category.name ? "text-black font-bold" : "text-gray-600 font-medium"} hover:text-gray-900 transition-colors`}
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
