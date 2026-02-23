'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function ExpenseFormModal({
      onClose,
      onSave,
      editingExpense,
}) {
      const [category, setCategory] = useState(
            editingExpense?.category || 'other'
      );

      const [description, setDescription] = useState(
            editingExpense?.description || ''
      );

      const [amount, setAmount] = useState(
            editingExpense ? editingExpense.amount.toString() : ''
      );

      const [date, setDate] = useState(
            editingExpense?.date ||
            new Date().toISOString().split('T')[0]
      );

      const [isRecurring, setIsRecurring] = useState(
            editingExpense?.isRecurring || false
      );

      const [recurringFrequency, setRecurringFrequency] =
            useState(
                  editingExpense?.recurringFrequency || 'monthly'
            );

      const handleSave = () => {
            if (!description || !amount || !date) {
                  alert('Please fill in all required fields');
                  return;
            }

            const expense = {
                  id: editingExpense?.id || Date.now().toString(),
                  category,
                  description,
                  amount: parseFloat(amount),
                  date,
                  isRecurring,
                  recurringFrequency: isRecurring
                        ? recurringFrequency
                        : undefined,
                  createdAt:
                        editingExpense?.createdAt ||
                        new Date().toISOString(),
            };

            onSave(expense);
      };

      return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                  <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">

                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800">
                              <h2 className="text-lg font-semibold">
                                    {editingExpense
                                          ? 'Edit Expense'
                                          : 'Log New Expense'}
                              </h2>

                              <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition"
                              >
                                    <X size={20} />
                              </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">

                              {/* Category */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Category *
                                    </label>
                                    <select
                                          value={category}
                                          onChange={(e) =>
                                                setCategory(e.target.value)
                                          }
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                          <option value="salary">
                                                Employee Salaries
                                          </option>
                                          <option value="rent">
                                                Office Rent
                                          </option>
                                          <option value="utilities">
                                                Utilities & Infrastructure
                                          </option>
                                          <option value="licenses">
                                                Software Licenses
                                          </option>
                                          <option value="other">
                                                Other Expenses
                                          </option>
                                    </select>
                              </div>

                              {/* Description */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Description *
                                    </label>
                                    <input
                                          type="text"
                                          value={description}
                                          onChange={(e) =>
                                                setDescription(e.target.value)
                                          }
                                          placeholder="e.g., Monthly salary for John"
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              {/* Amount */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Amount *
                                    </label>
                                    <input
                                          type="number"
                                          value={amount}
                                          onChange={(e) =>
                                                setAmount(e.target.value)
                                          }
                                          placeholder="0"
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              {/* Date */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Date *
                                    </label>
                                    <input
                                          type="date"
                                          value={date}
                                          onChange={(e) =>
                                                setDate(e.target.value)
                                          }
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              {/* Recurring */}
                              <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                                    <input
                                          type="checkbox"
                                          checked={isRecurring}
                                          onChange={(e) =>
                                                setIsRecurring(e.target.checked)
                                          }
                                          className="accent-blue-500"
                                    />
                                    <span className="text-sm text-gray-300">
                                          This is a recurring expense
                                    </span>
                              </div>

                              {isRecurring && (
                                    <div>
                                          <label className="block text-sm mb-2 text-gray-400">
                                                Frequency
                                          </label>
                                          <select
                                                value={recurringFrequency}
                                                onChange={(e) =>
                                                      setRecurringFrequency(
                                                            e.target.value
                                                      )
                                                }
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          >
                                                <option value="monthly">
                                                      Monthly
                                                </option>
                                                <option value="quarterly">
                                                      Quarterly
                                                </option>
                                                <option value="yearly">
                                                      Yearly
                                                </option>
                                          </select>
                                    </div>
                              )}

                              {/* Buttons */}
                              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                    <button
                                          onClick={onClose}
                                          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition"
                                    >
                                          Cancel
                                    </button>

                                    <button
                                          onClick={handleSave}
                                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
                                    >
                                          {editingExpense
                                                ? 'Update Expense'
                                                : 'Log Expense'}
                                    </button>
                              </div>

                        </div>
                  </div>
            </div>
      );
}
