'use client';

import {
      BarChart,
      Bar,
      XAxis,
      YAxis,
      CartesianGrid,
      Tooltip,
      Legend,
      ResponsiveContainer,
      PieChart,
      Pie,
      Cell,
} from 'recharts';

import {
      TrendingUp,
      TrendingDown,
      CheckCircle,
} from 'lucide-react';

export default function ReportsTab({
      installments,
      maintenanceInvoices,
      expenses,
}) {
      const formatCurrency = (amount) =>
            `৳ ${Number(amount).toLocaleString()}`;

      /* ---------------- Calculations ---------------- */

      const paidInstallments = installments.filter(
            (i) => i.status === 'paid'
      );

      const paidInvoices = maintenanceInvoices.filter(
            (i) => i.status === 'paid'
      );

      const totalRevenue =
            paidInstallments.reduce((s, i) => s + i.amount, 0) +
            paidInvoices.reduce((s, i) => s + i.amount, 0);

      const totalExpenses = expenses.reduce(
            (s, e) => s + e.amount,
            0
      );

      const netProfit = totalRevenue - totalExpenses;

      const totalTransactions =
            paidInstallments.length + paidInvoices.length;

      /* ---------------- Expense Breakdown ---------------- */

      const categoryBreakdown = expenses.reduce((acc, e) => {
            acc[e.category] =
                  (acc[e.category] || 0) + Number(e.amount);
            return acc;
      }, {});

      const expensePieData = Object.entries(categoryBreakdown)
            .filter(([value]) => value > 0)
            .map(([key, value]) => ({
                  name: key,
                  value,
            }));

      const COLORS = [
            '#3b82f6',
            '#f97316',
            '#10b981',
            '#a855f7',
            '#6b7280',
      ];

      /* ---------------- Monthly Data ---------------- */

      const monthlyData = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (5 - i));

            const monthLabel = date.toLocaleDateString('en-US', {
                  month: 'short',
            });

            const monthStart = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  1
            );

            const monthEnd = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
            );

            const monthRevenue = [...paidInstallments, ...paidInvoices]
                  .filter((t) => {
                        const d = new Date(t.paidDate || t.invoiceDate);
                        return d >= monthStart && d <= monthEnd;
                  })
                  .reduce((s, t) => s + t.amount, 0);

            const monthExpense = expenses
                  .filter((e) => {
                        const d = new Date(e.date);
                        return d >= monthStart && d <= monthEnd;
                  })
                  .reduce((s, e) => s + e.amount, 0);

            return {
                  month: monthLabel,
                  revenue: monthRevenue,
                  expenses: monthExpense,
                  profit: monthRevenue - monthExpense,
            };
      });

      return (
            <div className="min-h-screen bg-gray-950 text-white p-6 space-y-8">

                  <h2 className="text-2xl font-bold">
                        Financial Reports
                  </h2>

                  {/* ================= SUMMARY CARDS ================= */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Revenue */}
                        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
                              <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp className="text-green-400" />
                                    <span className="text-sm text-gray-400">
                                          Total Revenue
                                    </span>
                              </div>
                              <p className="text-3xl font-bold text-green-400">
                                    {formatCurrency(totalRevenue)}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                    {totalTransactions} paid transactions
                              </p>
                        </div>

                        {/* Expenses */}
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                              <div className="flex items-center gap-3 mb-3">
                                    <TrendingDown className="text-red-400" />
                                    <span className="text-sm text-gray-400">
                                          Total Expenses
                                    </span>
                              </div>
                              <p className="text-3xl font-bold text-red-400">
                                    {formatCurrency(totalExpenses)}
                              </p>
                        </div>

                        {/* Profit */}
                        <div
                              className={`p-6 rounded-2xl border ${netProfit >= 0
                                    ? 'bg-green-500/10 border-green-500/20'
                                    : 'bg-red-500/10 border-red-500/20'
                                    }`}
                        >
                              <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle
                                          className={
                                                netProfit >= 0
                                                      ? 'text-green-400'
                                                      : 'text-red-400'
                                          }
                                    />
                                    <span className="text-sm text-gray-400">
                                          Net Profit / Loss
                                    </span>
                              </div>
                              <p
                                    className={`text-3xl font-bold ${netProfit >= 0
                                          ? 'text-green-400'
                                          : 'text-red-400'
                                          }`}
                              >
                                    {formatCurrency(netProfit)}
                              </p>
                        </div>
                  </div>

                  {/* ================= CHARTS ================= */}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Bar Chart */}
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                              <h3 className="text-sm font-semibold mb-4">
                                    6 Month Trend
                              </h3>

                              <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyData}>
                                          <CartesianGrid stroke="#1f2937" />
                                          <XAxis dataKey="month" stroke="#9ca3af" />
                                          <YAxis stroke="#9ca3af" />
                                          <Tooltip />
                                          <Legend />
                                          <Bar dataKey="revenue" fill="#10b981" />
                                          <Bar dataKey="expenses" fill="#ef4444" />
                                          <Bar dataKey="profit" fill="#3b82f6" />
                                    </BarChart>
                              </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        {expensePieData.length > 0 && (
                              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                                    <h3 className="text-sm font-semibold mb-4">
                                          Expense Breakdown
                                    </h3>

                                    <ResponsiveContainer width="100%" height={300}>
                                          <PieChart>
                                                <Pie
                                                      data={expensePieData}
                                                      dataKey="value"
                                                      nameKey="name"
                                                      outerRadius={90}
                                                      label
                                                >
                                                      {expensePieData.map((_, index) => (
                                                            <Cell
                                                                  key={index}
                                                                  fill={COLORS[index % COLORS.length]}
                                                            />
                                                      ))}
                                                </Pie>
                                                <Tooltip
                                                      formatter={(value) =>
                                                            formatCurrency(value)
                                                      }
                                                />
                                          </PieChart>
                                    </ResponsiveContainer>
                              </div>
                        )}
                  </div>

                  {/* ================= KEY METRICS ================= */}

                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                        <h3 className="text-sm font-semibold mb-6">
                              Key Metrics
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                              <div>
                                    <p className="text-xs text-gray-400">
                                          Profit Margin
                                    </p>
                                    <p className="text-xl font-bold text-blue-400">
                                          {totalRevenue > 0
                                                ? Math.round(
                                                      (netProfit / totalRevenue) * 100
                                                )
                                                : 0}
                                          %
                                    </p>
                              </div>

                              <div>
                                    <p className="text-xs text-gray-400">
                                          Revenue / Expense Ratio
                                    </p>
                                    <p className="text-xl font-bold text-blue-400">
                                          {totalExpenses > 0
                                                ? (totalRevenue / totalExpenses).toFixed(
                                                      2
                                                )
                                                : 0}
                                          x
                                    </p>
                              </div>

                              <div>
                                    <p className="text-xs text-gray-400">
                                          Paid Transactions
                                    </p>
                                    <p className="text-xl font-bold text-blue-400">
                                          {totalTransactions}
                                    </p>
                              </div>

                              <div>
                                    <p className="text-xs text-gray-400">
                                          Pending Revenue
                                    </p>
                                    <p className="text-xl font-bold text-orange-400">
                                          {formatCurrency(
                                                [...installments, ...maintenanceInvoices]
                                                      .filter((i) => i.status === 'pending')
                                                      .reduce((s, i) => s + i.amount, 0)
                                          )}
                                    </p>
                              </div>

                        </div>
                  </div>
            </div>
      );
}
