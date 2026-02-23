'use client';

import { useState } from 'react';
import { Plus, Trash2, Filter } from 'lucide-react';
import ProjectFormModal from '../modal/ProjectFormModal';
import ExpenseFormModal from '../modal/ExpenseFormModal';

export default function ExpensesTab({ expenses, setExpenses }) {
      const [showForm, setShowForm] = useState(false);
      const [editingExpense, setEditingExpense] = useState(null);
      const [filterCategory, setFilterCategory] = useState('all');

      const handleAddExpense = (expense) => {
            if (editingExpense) {
                  setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)));
            } else {
                  setExpenses([...expenses, expense]);
            }
            setShowForm(false);
            setEditingExpense(null);
      };

      const handleDeleteExpense = (id) => {
            setExpenses(expenses.filter((e) => e.id !== id));
      };

      const formatCurrency = (amount) => {
            return `৳ ${amount.toLocaleString()}`;
      };

      const formatDate = (date) => {
            return new Date(date).toLocaleDateString();
      };

      const categoryBreakdown = expenses.reduce((acc, expense) => {
            acc[expense.category] =
                  (acc[expense.category] || 0) + Number(expense.amount);
            return acc;
      }, {});

      const filteredExpenses =
            filterCategory === 'all'
                  ? expenses
                  : expenses.filter((e) => e.category === filterCategory);

      const sortedExpenses = [...filteredExpenses].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
      );

      return (
            <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6">

                  {/* Header */}
                  <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold tracking-tight">
                              Operating Expenses
                        </h2>

                        <button
                              onClick={() => setShowForm(true)}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                              <Plus size={16} />
                              Log Expense
                        </button>
                  </div>

                  {/* Category Summary */}
                  {expenses.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                              {Object.entries(categoryBreakdown).map(([category, amount]) => (
                                    <div
                                          key={category}
                                          className="bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-800"
                                    >
                                          <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                                                {category}
                                          </p>
                                          <p className="text-2xl font-bold text-blue-500">
                                                {formatCurrency(amount)}
                                          </p>
                                    </div>
                              ))}
                        </div>
                  )}

                  {/* Expense List */}
                  <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800">

                        {/* Filter Header */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-800">
                              <h3 className="text-lg font-semibold">Expense List</h3>

                              <div className="flex items-center gap-3">
                                    <Filter size={16} className="text-gray-400" />

                                    <select
                                          value={filterCategory}
                                          onChange={(e) => setFilterCategory(e.target.value)}
                                          className="bg-gray-800 text-sm border border-gray-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                          <option value="all">All Categories</option>
                                          <option value="salary">Salary</option>
                                          <option value="rent">Rent</option>
                                          <option value="utilities">Utilities</option>
                                          <option value="licenses">Licenses</option>
                                          <option value="other">Other</option>
                                    </select>
                              </div>
                        </div>

                        {/* List Content */}
                        <div className="p-5 space-y-3">
                              {sortedExpenses.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8 text-sm">
                                          No expenses found.
                                    </p>
                              ) : (
                                    sortedExpenses.map((expense) => (
                                          <div
                                                key={expense.id}
                                                className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 transition p-4 rounded-xl"
                                          >
                                                <div>
                                                      <p className="font-medium">{expense.description}</p>
                                                      <p className="text-xs text-gray-400 mt-1">
                                                            {formatDate(expense.date)} • {expense.category}
                                                      </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                      <span className="text-red-400 font-semibold text-lg">
                                                            -{formatCurrency(expense.amount)}
                                                      </span>

                                                      <button
                                                            onClick={() => handleDeleteExpense(expense.id)}
                                                            className="text-gray-400 hover:text-red-500 transition"
                                                      >
                                                            <Trash2 size={16} />
                                                      </button>
                                                </div>
                                          </div>
                                    ))
                              )}
                        </div>
                  </div>

                  {showForm && (
                        <ExpenseFormModal
                              onClose={() => setShowForm(false)}
                              onSave={handleAddExpense}
                              editingExpense={editingExpense}
                        />
                  )}


                  {expenses.some((e) => e.isRecurring) && (
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-2xl p-5">
                              <h3 className="text-orange-400 font-semibold mb-3">
                                    Recurring Expenses
                              </h3>

                              <div className="space-y-2">
                                    {expenses
                                          .filter((e) => e.isRecurring)
                                          .map((expense) => (
                                                <div
                                                      key={expense.id}
                                                      className="flex justify-between text-sm"
                                                >
                                                      <span className="text-gray-400">
                                                            {expense.description} ({expense.recurringFrequency})
                                                      </span>
                                                      <span className="text-white font-medium">
                                                            {formatCurrency(expense.amount)}
                                                      </span>
                                                </div>
                                          ))}
                              </div>
                        </div>
                  )}
            </div>
      );
}
