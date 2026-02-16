import React from "react";

export default function Summary({ transactions }) {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <p className="text-gray-600 text-sm font-semibold mb-2">GELİR</p>
        <p className="text-3xl font-bold text-green-600">{income.toFixed(2)} TL</p>
      </div>

      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <p className="text-gray-600 text-sm font-semibold mb-2">GİDER</p>
        <p className="text-3xl font-bold text-red-600">{expenses.toFixed(2)} TL</p>
      </div>

      <div className={`bg-white p-6 rounded-lg border border-gray-300`}>
        <p className="text-gray-600 text-sm font-semibold mb-2">NET TUTAR</p>
        <p className={`text-3xl font-bold text-black`}>{balance.toFixed(2)} TL</p>
      </div>
    </div>
  );
}
