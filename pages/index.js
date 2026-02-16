import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Summary from "../components/Summary";
import Filters from "../components/Filters";
import Head from "next/head";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ type: "all", category: "all", sort: "desc", amountSort: "none", search: "" });

  // Load transactions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, id: crypto.randomUUID() }, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
  };

  let filteredTransactions = transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;

    if (filters.category !== "all") {
      if (filters.type === "all") {
        // category stored as "type-name" when type is all
        const parts = String(filters.category).split("-");
        if (parts.length === 2) {
          const [catType, catName] = parts;
          if (t.type !== catType || t.category !== catName) return false;
        } else {
          // fallback to plain name
          if (t.category !== filters.category) return false;
        }
      } else {
        if (t.category !== filters.category) return false;
      }
    }

    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // For summary, don't filter by search
  let summaryTransactions = transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;

    if (filters.category !== "all") {
      if (filters.type === "all") {
        const parts = String(filters.category).split("-");
        if (parts.length === 2) {
          const [catType, catName] = parts;
          if (t.type !== catType || t.category !== catName) return false;
        } else {
          if (t.category !== filters.category) return false;
        }
      } else {
        if (t.category !== filters.category) return false;
      }
    }

    return true;
  });

  // Sort transactions
  filteredTransactions = filteredTransactions.sort((a, b) => {
    const sortType = filters.sortType || "default";

    // Varsayılan: sıralama yok
    if (sortType === "default") {
      return 0; // Ekleme sırasını koru
    }

    const [sortBy, sortOrder] = sortType.split("_");

    if (sortBy === "tutar") {
      const amountDiff = sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      if (amountDiff !== 0) return amountDiff;
      // Tutar eşitse tarih'e göre (en yeni)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    } else {
      // tarih
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    }
  });

  return (
    <>
      <Head>
        <title>Gelir & Gider Takip Sistemi</title>
        <meta name="description" content="Gelir ve giderlerinizi takip etmek için basit ve etkili bir sistem" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-[948px] mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Gelir & Gider Takip Sistemi</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <TransactionForm onAdd={addTransaction} />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Summary transactions={summaryTransactions} />
              </div>

              <div className="mb-6">
                <Filters filters={filters} setFilters={setFilters} />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <TransactionList
                  transactions={filteredTransactions}
                  totalTransactions={transactions.length}
                  onDelete={deleteTransaction}
                  onUpdate={updateTransaction}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
