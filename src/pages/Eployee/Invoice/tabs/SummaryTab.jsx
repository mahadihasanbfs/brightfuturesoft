'use client';

import {
      TrendingUp,
      TrendingDown,
      DollarSign,
      AlertCircle,
} from 'lucide-react';

export default function SummaryTab({
      projects,
      installments,
      maintenance,
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

      const activeProjects = projects.filter(
            (p) => p.status === 'in-progress'
      ).length;

      const activeMaintenance = maintenance.filter(
            (m) => m.status === 'active'
      ).length;

      const pendingInstallments = installments.filter(
            (i) => i.status === 'pending'
      );

      const pendingAmount = pendingInstallments.reduce(
            (s, i) => s + i.amount,
            0
      );

      const profitMargin =
            totalRevenue > 0
                  ? Math.round((netProfit / totalRevenue) * 100)
                  : 0;

      /* ---------------- UI ---------------- */

      return (
            <div className="min-h-screen bg-gray-950 text-white p-6 space-y-8">

                  {/* ================= KPI CARDS ================= */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Revenue */}
                        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
                              <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-400">
                                          Total Revenue
                                    </span>
                                    <TrendingUp className="text-green-400" size={18} />
                              </div>
                              <p className="text-3xl font-bold text-green-400">
                                    {formatCurrency(totalRevenue)}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                    {paidInstallments.length +
                                          paidInvoices.length}{' '}
                                    paid transactions
                              </p>
                        </div>

                        {/* Expenses */}
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                              <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-400">
                                          Total Expenses
                                    </span>
                                    <TrendingDown className="text-red-400" size={18} />
                              </div>
                              <p className="text-3xl font-bold text-red-400">
                                    {formatCurrency(totalExpenses)}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                    {expenses.length} expenses logged
                              </p>
                        </div>

                        {/* Profit */}
                        <div
                              className={`p-6 rounded-2xl border ${netProfit >= 0
                                          ? 'bg-green-500/10 border-green-500/20'
                                          : 'bg-red-500/10 border-red-500/20'
                                    }`}
                        >
                              <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-400">
                                          Net Profit
                                    </span>
                                    <DollarSign
                                          className={
                                                netProfit >= 0
                                                      ? 'text-green-400'
                                                      : 'text-red-400'
                                          }
                                          size={18}
                                    />
                              </div>
                              <p
                                    className={`text-3xl font-bold ${netProfit >= 0
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                          }`}
                              >
                                    {formatCurrency(netProfit)}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                    {profitMargin}% profit margin
                              </p>
                        </div>
                  </div>

                  {/* ================= QUICK STATS ================= */}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
                              <p className="text-xs text-gray-400 mb-2">
                                    Active Projects
                              </p>
                              <p className="text-3xl font-bold text-blue-400">
                                    {activeProjects}
                              </p>
                              <p className="text-xs text-gray-500">
                                    of {projects.length} total
                              </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
                              <p className="text-xs text-gray-400 mb-2">
                                    Active Maintenance
                              </p>
                              <p className="text-3xl font-bold text-blue-400">
                                    {activeMaintenance}
                              </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
                              <p className="text-xs text-gray-400 mb-2">
                                    Pending Installments
                              </p>
                              <p className="text-3xl font-bold text-orange-400">
                                    {pendingInstallments.length}
                              </p>
                              <p className="text-xs text-gray-500">
                                    {formatCurrency(pendingAmount)}
                              </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
                              <p className="text-xs text-gray-400 mb-2">
                                    Profit Margin
                              </p>
                              <p
                                    className={`text-3xl font-bold ${netProfit >= 0
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                          }`}
                              >
                                    {profitMargin}%
                              </p>
                        </div>
                  </div>

                  {/* ================= RECENT ACTIVITY ================= */}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Recent Projects */}
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                              <h3 className="text-sm font-semibold mb-4">
                                    Recent Projects
                              </h3>

                              {projects.length === 0 ? (
                                    <p className="text-sm text-gray-400">
                                          No projects yet.
                                    </p>
                              ) : (
                                    <div className="space-y-4">
                                          {projects.slice(-3).map((project) => (
                                                <div
                                                      key={project.id}
                                                      className="border-b border-gray-800 pb-3 last:border-0"
                                                >
                                                      <p className="text-sm font-medium">
                                                            {project.projectName}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                            {project.clientName}
                                                      </p>
                                                      <div className="flex justify-between mt-2">
                                                            <span className="text-xs text-gray-400 capitalize">
                                                                  {project.status}
                                                            </span>
                                                            <span className="text-sm font-medium">
                                                                  {formatCurrency(
                                                                        project.totalContractValue
                                                                  )}
                                                            </span>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              )}
                        </div>

                        {/* Recent Expenses */}
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                              <h3 className="text-sm font-semibold mb-4">
                                    Recent Expenses
                              </h3>

                              {expenses.length === 0 ? (
                                    <p className="text-sm text-gray-400">
                                          No expenses logged.
                                    </p>
                              ) : (
                                    <div className="space-y-4">
                                          {expenses.slice(-3).map((expense) => (
                                                <div
                                                      key={expense.id}
                                                      className="border-b border-gray-800 pb-3 last:border-0"
                                                >
                                                      <div className="flex justify-between">
                                                            <div>
                                                                  <p className="text-sm font-medium">
                                                                        {expense.description}
                                                                  </p>
                                                                  <p className="text-xs text-gray-500 capitalize">
                                                                        {expense.category}
                                                                  </p>
                                                            </div>
                                                            <span className="text-red-400 text-sm font-medium">
                                                                  {formatCurrency(expense.amount)}
                                                            </span>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              )}
                        </div>
                  </div>

                  {/* ================= ALERT ================= */}

                  {netProfit < 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl flex items-start gap-3">
                              <AlertCircle className="text-red-400 mt-1" size={18} />
                              <div>
                                    <p className="font-semibold text-red-400">
                                          Negative Profit Warning
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                          Expenses exceed revenue. Consider reviewing
                                          pricing or reducing operational costs.
                                    </p>
                              </div>
                        </div>
                  )}
            </div>
      );
}
