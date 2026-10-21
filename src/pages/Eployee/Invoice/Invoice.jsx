import { useContext, useEffect, useState } from 'react';
import { BarChart3, FileText, Users, Wallet, Receipt, TrendingUp } from 'lucide-react';
import { AuthContext } from '../../../context/UseContext/AuthProvider';
import DashboardTab from './tabs/DashboardTab';
import InvoicesTab from './tabs/InvoicesTab';
import ClientsTab from './tabs/ClientsTab';
import SalaryTab from './tabs/SalaryTab';
import ExpensesTab from './tabs/ExpensesTab';
import ReportsTab from './tabs/ReportsTab';

// Same rule the dashboard uses; the API enforces it again with the JWT.
const ADMIN_DESIGNATIONS = ['Chief Executive Officer', 'manager'];

const TABS = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3, Component: DashboardTab },
      { id: 'invoices', label: 'Invoices', icon: FileText, Component: InvoicesTab },
      { id: 'clients', label: 'Clients', icon: Users, Component: ClientsTab },
      { id: 'salary', label: 'Salary', icon: Wallet, Component: SalaryTab },
      { id: 'expenses', label: 'Expenses', icon: Receipt, Component: ExpensesTab },
      { id: 'reports', label: 'Reports', icon: TrendingUp, Component: ReportsTab },
];

export default function Invoice() {
      const { user } = useContext(AuthContext);
      const [activeTab, setActiveTab] = useState('dashboard');

      useEffect(() => {
            window.scrollTo(0, 0);
      }, []);

      if (!ADMIN_DESIGNATIONS.includes(user?.designation)) {
            return (
                  <main className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400">
                        Account management is available to admins only.
                  </main>
            );
      }

      const { Component } = TABS.find((t) => t.id === activeTab);

      return (
            <main className="min-h-screen bg-gray-950 text-white">
                  <header className="border-b border-gray-800 bg-gray-900 px-8 py-6">
                        <h1 className="text-2xl font-bold">Account Management</h1>
                        <p className="text-sm text-gray-400">Client invoices, payments, salary and expenses</p>
                  </header>

                  <nav className="border-b border-gray-800 bg-gray-900 px-8">
                        <div className="flex gap-8 overflow-x-auto">
                              {TABS.map(({ id, label, icon: Icon }) => (
                                    <button
                                          key={id}
                                          onClick={() => setActiveTab(id)}
                                          className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition ${activeTab === id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                                    >
                                          <Icon size={16} />
                                          {label}
                                    </button>
                              ))}
                        </div>
                  </nav>

                  <div className="p-8">
                        <Component />
                  </div>
            </main>
      );
}
