'use client';

import { useState, useEffect } from 'react';


import {
      BarChart3,
      Package,
      Wrench,
      Receipt,
      TrendingUp,
} from 'lucide-react';
import SummaryTab from './tabs/SummaryTab';
import MaintenanceTab from './tabs/MaintenanceTab';
import ExpensesTab from './tabs/ExpensesTab';
import ReportsTab from './tabs/ReportsTab';
import ProjectsTab from './tabs/ProjectsTab';

export default function Home() {
      const [activeTab, setActiveTab] = useState('summary');

      useEffect(() => {
            window.scrollTo(0, 0);
      }, []); useEffect(() => {
            window.scrollTo(0, 0);
      }, [])

      const [projects, setProjects] = useState([]);
      const [installments, setInstallments] = useState([]);
      const [maintenance, setMaintenance] = useState([]);
      const [maintenanceInvoices, setMaintenanceInvoices] = useState([]);
      const [expenses, setExpenses] = useState([]);

      /* ================= LOCAL STORAGE ================= */

      useEffect(() => {
            const savedProjects = localStorage.getItem('projects');
            const savedInstallments = localStorage.getItem('installments');
            const savedMaintenance = localStorage.getItem('maintenance');
            const savedInvoices = localStorage.getItem('maintenanceInvoices');
            const savedExpenses = localStorage.getItem('expenses');

            if (savedProjects) setProjects(JSON.parse(savedProjects));
            if (savedInstallments) setInstallments(JSON.parse(savedInstallments));
            if (savedMaintenance) setMaintenance(JSON.parse(savedMaintenance));
            if (savedInvoices) setMaintenanceInvoices(JSON.parse(savedInvoices));
            if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      }, []);

      useEffect(() => {
            localStorage.setItem('projects', JSON.stringify(projects));
      }, [projects]);

      useEffect(() => {
            localStorage.setItem('installments', JSON.stringify(installments));
      }, [installments]);

      useEffect(() => {
            localStorage.setItem('maintenance', JSON.stringify(maintenance));
      }, [maintenance]);

      useEffect(() => {
            localStorage.setItem(
                  'maintenanceInvoices',
                  JSON.stringify(maintenanceInvoices)
            );
      }, [maintenanceInvoices]);

      useEffect(() => {
            localStorage.setItem('expenses', JSON.stringify(expenses));
      }, [expenses]);

      /* ================= TAB NAVIGATION ================= */

      const tabs = [
            { id: 'summary', label: 'Summary', icon: BarChart3 },
            { id: 'projects', label: 'Projects', icon: Package },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'reports', label: 'Reports', icon: TrendingUp },
      ];

      return (
            <main className="min-h-screen bg-gray-950 text-white">

                  {/* ================= HEADER ================= */}

                  <header className="border-b border-gray-800 bg-gray-900 px-8 py-6">
                        <div className="flex items-center gap-4">
                              {/* <BarChart3 className="text-blue-500" size={28} /> */}
                              <div>
                                    <h1 className="text-2xl font-bold">
                                          Account Management
                                    </h1>
                                    <p className="text-sm text-gray-400">
                                          Software Development Business Management
                                    </p>
                              </div>
                        </div>
                  </header>

                  {/* ================= TABS ================= */}

                  <div className="border-b border-gray-800 bg-gray-900 px-8">
                        <div className="flex gap-8 overflow-x-auto">

                              {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;

                                    return (
                                          <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition ${isActive
                                                      ? 'border-blue-500 text-blue-400'
                                                      : 'border-transparent text-gray-400 hover:text-white'
                                                      }`}
                                          >
                                                <Icon size={16} />
                                                {tab.label}
                                          </button>
                                    );
                              })}

                        </div>
                  </div>

                  {/* ================= CONTENT ================= */}

                  <div className="p-8">

                        {activeTab === 'summary' && (
                              <SummaryTab
                                    projects={projects}
                                    installments={installments}
                                    maintenance={maintenance}
                                    maintenanceInvoices={maintenanceInvoices}
                                    expenses={expenses}
                              />
                        )}

                        {activeTab === 'projects' && (
                              <ProjectsTab
                                    projects={projects}
                                    setProjects={setProjects}
                                    installments={installments}
                                    setInstallments={setInstallments}
                              />
                        )}

                        {activeTab === 'maintenance' && (
                              <MaintenanceTab
                                    maintenance={maintenance}
                                    setMaintenance={setMaintenance}
                                    maintenanceInvoices={maintenanceInvoices}
                                    setMaintenanceInvoices={setMaintenanceInvoices}
                                    projects={projects}
                              />
                        )}

                        {activeTab === 'expenses' && (
                              <ExpensesTab
                                    expenses={expenses}
                                    setExpenses={setExpenses}
                              />
                        )}

                        {activeTab === 'reports' && (
                              <ReportsTab
                                    installments={installments}
                                    maintenanceInvoices={maintenanceInvoices}
                                    expenses={expenses}
                              />
                        )}

                  </div>
            </main>
      );
}
