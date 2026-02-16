import React, { useState, useEffect, useRef } from "react";
import CATEGORIES from "../interfaces/categories";

export default function TransactionList({ transactions, totalTransactions = 0, onDelete, onUpdate }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const menuRef = useRef({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId) {
        // Check if click target is within the menu container for this transaction
        const menuContainer = menuRef.current[openMenuId];
        if (menuContainer && !menuContainer.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  const formatDate = (dateString) => {
    try {
      // dateString format: "2026-02-13T03:06" (datetime-local) veya "2026-02-13" (eski format)
      if (!dateString) return "-";

      // Eğer "T" varsa datetime-local format
      if (dateString.includes("T")) {
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes] = timePart.split(":");
        return `${day}.${month}.${year} ${hours}:${minutes}`;
      } else {
        // Eski date-only format
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
      }
    } catch (error) {
      return dateString || "-";
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date || ""
    });
    setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
    if (editData.title && editData.amount) {
      onUpdate(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">İşlemler</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {totalTransactions > 0 ? "Filtreleme kriterleriyle eşleşen işlem yok" : "Henüz işlem yok"}
        </p>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div key={transaction.id}>
              {editingId === transaction.id ? (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Başlık"
                    />
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Tutar"
                      step="0.01"
                    />
                    <select
                      value={editData.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setEditData({ ...editData, type: newType, category: CATEGORIES[newType][0] });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
                    >
                      <option value="income">Gelir</option>
                      <option value="expense">Gider</option>
                    </select>
                    <select
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
                    >
                      {CATEGORIES[editData.type]?.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="datetime-local"
                    value={editData.date}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-gray-800">{transaction.title}</h3>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                    <p className="text-xs text-gray-600">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold text-lg ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.amount.toFixed(2)} TL
                    </span>
                  <div
                    className="relative"
                    ref={(el) => {
                      if (el) menuRef.current[transaction.id] = el;
                    }}
                  >
                    <button
                      onClick={() => setOpenMenuId(openMenuId === transaction.id ? null : transaction.id)}
                      className="text-gray-600 hover:text-gray-800 text-lg p-1 cursor-pointer"
                    >
                      •••
                    </button>
                    {openMenuId === transaction.id && (
                      <div className="absolute left-full ml-1 top-0 w-28 bg-white border border-gray-200 rounded-sm shadow-lg z-10 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEdit(transaction);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-semibold border-b border-gray-200 cursor-pointer"
                          >
                            Güncelle
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDelete(transaction.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50/40 text-red-600 font-semibold cursor-pointer"
                          >
                            Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
