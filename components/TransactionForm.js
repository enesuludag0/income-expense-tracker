import React, { useState } from "react";
import CATEGORIES from "../interfaces/categories";

const getLocalDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function TransactionForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: CATEGORIES.expense[0],
    date: getLocalDateTime()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        category: CATEGORIES[value][0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "amount" ? parseFloat(value) : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.amount) {
      onAdd(formData);
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: CATEGORIES.expense[0],
        date: getLocalDateTime()
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">İşlem Ekle</h2>

      <input
        type="text"
        name="title"
        placeholder="Başlık"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
      />

      <input
        type="number"
        name="amount"
        placeholder="Tutar"
        value={formData.amount}
        onChange={handleChange}
        step="0.01"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
      >
        <option value="income">Gelir</option>
        <option value="expense">Gider</option>
      </select>

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
      >
        {CATEGORIES[formData.type].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
      >
        İşlem Ekle
      </button>
    </form>
  );
}
