import React, { useState, useEffect } from "react";

function App() {
  const [walletBalance, setWalletBalance] = useState(5000);
  const [expenses, setExpenses] = useState([]);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState("");

  const [expenseData, setExpenseData] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    const storedExpenses =
      JSON.parse(localStorage.getItem("expenses")) || [];

    const storedWallet =
      JSON.parse(localStorage.getItem("walletBalance"));

    setExpenses(storedExpenses);

    if (storedWallet !== null) {
      setWalletBalance(storedWallet);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );

    localStorage.setItem(
      "walletBalance",
      JSON.stringify(walletBalance)
    );
  }, [expenses, walletBalance]);

  const addIncome = (e) => {
    e.preventDefault();

    if (!incomeAmount || Number(incomeAmount) <= 0) return;

    setWalletBalance(
      (prev) => prev + Number(incomeAmount)
    );

    setIncomeAmount("");
    setShowIncomeModal(false);
  };

  const addExpense = (e) => {
    e.preventDefault();

    const { title, price, category, date } = expenseData;

    if (!title || !price || !category || !date) {
      alert("Please fill all fields");
      return;
    }

    if (Number(price) > walletBalance) {
      alert("Insufficient wallet balance");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title,
      price: Number(price),
      category,
      date,
    };

    setExpenses([...expenses, newExpense]);

    setWalletBalance(
      (prev) => prev - Number(price)
    );

    setExpenseData({
      title: "",
      price: "",
      category: "",
      date: "",
    });

    setShowExpenseModal(false);
  };

  const deleteExpense = (id) => {
    const expense = expenses.find(
      (item) => item.id === id
    );

    setWalletBalance(
      (prev) => prev + expense.price
    );

    setExpenses(
      expenses.filter((item) => item.id !== id)
    );
  };

  const totalExpense = expenses.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense Tracker</h1>

      <h2>
        Wallet Balance: ₹{walletBalance}
      </h2>

      <button
        type="button"
        onClick={() =>
          setShowIncomeModal(true)
        }
      >
        + Add Income
      </button>

      <h2>
        Expenses: ₹{totalExpense}
      </h2>

      <button
        type="button"
        onClick={() =>
          setShowExpenseModal(true)
        }
      >
        + Add Expense
      </button>

      {showIncomeModal && (
        <form onSubmit={addIncome}>
          <h3>Add Balance</h3>

          <input
            type="number"
            placeholder="Income Amount"
            value={incomeAmount}
            onChange={(e) =>
              setIncomeAmount(e.target.value)
            }
          />

          <button type="submit">
            Add Balance
          </button>

          <button
            type="button"
            onClick={() =>
              setShowIncomeModal(false)
            }
          >
            Cancel
          </button>
        </form>
      )}

      {showExpenseModal && (
        <form onSubmit={addExpense}>
          <h3>Add Expenses</h3>

          <input
            name="title"
            placeholder="Title"
            value={expenseData.title}
            onChange={(e) =>
              setExpenseData({
                ...expenseData,
                title: e.target.value,
              })
            }
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={expenseData.price}
            onChange={(e) =>
              setExpenseData({
                ...expenseData,
                price: e.target.value,
              })
            }
          />

          <select
            name="category"
            value={expenseData.category}
            onChange={(e) =>
              setExpenseData({
                ...expenseData,
                category: e.target.value,
              })
            }
          >
            <option value="">
              Select Category
            </option>
            <option value="Food">
              Food
            </option>
            <option value="Entertainment">
              Entertainment
            </option>
            <option value="Travel">
              Travel
            </option>
          </select>

          <input
            name="date"
            type="date"
            value={expenseData.date}
            onChange={(e) =>
              setExpenseData({
                ...expenseData,
                date: e.target.value,
              })
            }
          />

          <button type="submit">
            Add Expense
          </button>

          <button
            type="button"
            onClick={() =>
              setShowExpenseModal(false)
            }
          >
            Cancel
          </button>
        </form>
      )}

      <h2>Recent Transactions</h2>

      {expenses.length === 0 ? (
        <p>No transactions!</p>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>{expense.title}</p>
            <p>₹{expense.price}</p>
            <p>{expense.category}</p>
            <p>{expense.date}</p>

            <button
              type="button"
              onClick={() =>
                deleteExpense(expense.id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;