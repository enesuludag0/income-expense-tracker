import React from "react";
import CATEGORIES from "../interfaces/categories";
import { IoSearch } from "react-icons/io5";

export default function Filters({ filters, setFilters }) {
  const getCategories = () => {
    if (filters.type === "all") {
      const income = CATEGORIES.income.map((cat) => ({ type: "income", name: cat }));
      const expense = CATEGORIES.expense.map((cat) => ({ type: "expense", name: cat }));
      return [...income, ...expense];
    }
    return CATEGORIES[filters.type]?.map((cat) => ({ type: filters.type, name: cat })) || [];
  };

  const categories = getCategories();

  return (
    <div>
      {/* <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2> */}
      <div className="flex flex-wrap gap-2">
        <select
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value, category: "all" }))}
        >
          <option value="all">Tüm Türler</option>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>
        <select
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((c) => {
            // Only special-case the "Diğer" label when type is 'all'
            const isOther = c.name === "Diğer";
            const optionValue = filters.type === "all" && isOther ? `${c.type}-${c.name}` : c.name;
            const optionLabel =
              filters.type === "all" && isOther
                ? `${c.name} (${c.type === "income" ? "Gelir" : "Gider"})`
                : c.name;
            return (
              <option key={`${c.type}-${c.name}`} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <select
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
          value={filters.sortType || "default"}
          onChange={(e) => setFilters((f) => ({ ...f, sortType: e.target.value }))}
        >
          <option value="default">Gelişmiş Sıralama</option>
          <option value="tutar_asc">Tutara göre (Önce en düşük)</option>
          <option value="tutar_desc">Tutara göre (Önce en yüksek)</option>
          <option value="tarih_asc">Tarihe göre (Önce en eski)</option>
          <option value="tarih_desc">Tarihe göre (Önce en yeni)</option>
        </select>
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Başlık Ara"
            value={filters.search || ""}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}
