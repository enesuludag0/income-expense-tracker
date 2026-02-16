/**
 * Transaction interface (JS doc for IDEs)
 * @typedef {Object} Transaction
 * @property {number} id
 * @property {'income'|'expense'} type
 * @property {string} title
 * @property {number} amount
 * @property {string} category
 * @property {string} date ISO string

*/

/** Create a transaction object */
export function createTransaction({ type, title, amount, category, date }) {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    amount: Number(amount) || 0,
    category: category || "Uncategorized",
    date: date || new Date().toISOString()
  };
}

export default null;
