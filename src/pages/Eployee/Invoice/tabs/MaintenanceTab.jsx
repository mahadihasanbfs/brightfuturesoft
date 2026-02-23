'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import MaintenanceFormModal from '../modal/MaintenanceFormModal';

export default function MaintenanceTab({
      maintenance,
      setMaintenance,
      maintenanceInvoices,
      setMaintenanceInvoices,
      projects,
}) {
      const [showForm, setShowForm] = useState(false);
      const [expandedContract, setExpandedContract] = useState(null);
      const [editingContract, setEditingContract] = useState(null);

      const formatCurrency = (amount) => `৳ ${Number(amount).toLocaleString()}`;
      const formatDate = (date) => new Date(date).toLocaleDateString();

      const handleAddContract = (contract) => {
            if (editingContract) {
                  setMaintenance(
                        maintenance.map((m) => (m.id === contract.id ? contract : m))
                  );
            } else {
                  setMaintenance([...maintenance, contract]);
            }
            setShowForm(false);
            setEditingContract(null);
      };

      const handleDeleteContract = (contractId) => {
            setMaintenance(maintenance.filter((m) => m.id !== contractId));
            setMaintenanceInvoices(
                  maintenanceInvoices.filter((i) => i.contractId !== contractId)
            );
      };

      const handleAddInvoice = (contractId) => {
            const contract = maintenance.find((m) => m.id === contractId);
            if (!contract) return;

            const newInvoice = {
                  id: Date.now().toString(),
                  contractId,
                  amount: contract.monthlyCharge,
                  invoiceDate: new Date().toISOString().split('T')[0],
                  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0],
                  paidDate: null,
                  status: 'pending',
            };

            setMaintenanceInvoices([...maintenanceInvoices, newInvoice]);
      };

      const handleMarkInvoicePaid = (invoiceId) => {
            setMaintenanceInvoices(
                  maintenanceInvoices.map((i) =>
                        i.id === invoiceId
                              ? {
                                    ...i,
                                    status: 'paid',
                                    paidDate: new Date().toISOString().split('T')[0],
                              }
                              : i
                  )
            );
      };

      const handleDeleteInvoice = (invoiceId) => {
            setMaintenanceInvoices(
                  maintenanceInvoices.filter((i) => i.id !== invoiceId)
            );
      };

      return (
            <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6">

                  {showForm && (
                        <MaintenanceFormModal
                              onClose={() => setShowForm(false)}
                              onSave={handleAddContract}
                              editingContract={editingContract}
                        />
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold tracking-tight">
                              Maintenance Contracts
                        </h2>

                        <button
                              onClick={() => {
                                    setEditingContract(null);
                                    setShowForm(true);
                              }}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                              <Plus size={16} />
                              New Contract
                        </button>
                  </div>

                  {/* Empty State */}
                  {maintenance.length === 0 ? (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
                              <p className="text-gray-400">
                                    No maintenance contracts yet. Create one after project completion.
                              </p>
                        </div>
                  ) : (
                        <div className="space-y-4">
                              {maintenance.map((contract) => {
                                    const contractInvoices = maintenanceInvoices.filter(
                                          (i) => i.contractId === contract.id
                                    );

                                    const isExpanded = expandedContract === contract.id;

                                    return (
                                          <div
                                                key={contract.id}
                                                className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden"
                                          >

                                                {/* Contract Header */}
                                                <div
                                                      onClick={() =>
                                                            setExpandedContract(isExpanded ? null : contract.id)
                                                      }
                                                      className="cursor-pointer p-6 hover:bg-gray-800 transition"
                                                >
                                                      <div className="flex justify-between items-start">

                                                            <div>
                                                                  <h3 className="text-lg font-semibold">
                                                                        {contract.contractName}
                                                                  </h3>
                                                                  <p className="text-sm text-gray-400 mt-1">
                                                                        {contract.clientName}
                                                                  </p>
                                                            </div>

                                                            <div className="flex items-center gap-6">
                                                                  <div className="text-right">
                                                                        <p className="text-lg font-bold text-blue-500">
                                                                              {formatCurrency(contract.monthlyCharge)}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 capitalize">
                                                                              {contract.billingFrequency}
                                                                        </p>
                                                                  </div>

                                                                  {isExpanded ? (
                                                                        <ChevronUp size={20} />
                                                                  ) : (
                                                                        <ChevronDown size={20} />
                                                                  )}
                                                            </div>
                                                      </div>
                                                </div>

                                                {/* Contract Info */}
                                                <div className="px-6 pb-4 flex justify-between items-center">
                                                      <div className="flex gap-3 items-center">
                                                            <span
                                                                  className={`text-xs px-3 py-1 rounded-full font-medium ${contract.status === 'active'
                                                                        ? 'bg-green-500/20 text-green-400'
                                                                        : 'bg-gray-500/20 text-gray-400'
                                                                        }`}
                                                            >
                                                                  {contract.status}
                                                            </span>

                                                            <span className="text-xs text-gray-400">
                                                                  Started: {formatDate(contract.startDate)}
                                                            </span>
                                                      </div>

                                                      <div className="flex gap-3">
                                                            <button
                                                                  onClick={() => {
                                                                        setEditingContract(contract);
                                                                        setShowForm(true);
                                                                  }}
                                                                  className="text-sm text-blue-400 hover:text-blue-500 transition"
                                                            >
                                                                  Edit
                                                            </button>

                                                            <button
                                                                  onClick={() =>
                                                                        handleDeleteContract(contract.id)
                                                                  }
                                                                  className="text-red-400 hover:text-red-500 transition"
                                                            >
                                                                  <Trash2 size={16} />
                                                            </button>
                                                      </div>
                                                </div>

                                                {/* Expandable Invoice Section */}
                                                {isExpanded && (
                                                      <div className="border-t border-gray-800 p-6 space-y-4 bg-gray-950">

                                                            <div className="flex justify-between items-center">
                                                                  <h4 className="font-semibold text-sm">
                                                                        Invoices ({contractInvoices.length})
                                                                  </h4>

                                                                  <button
                                                                        onClick={() =>
                                                                              handleAddInvoice(contract.id)
                                                                        }
                                                                        className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-xs transition"
                                                                  >
                                                                        <Plus size={14} />
                                                                        Create Invoice
                                                                  </button>
                                                            </div>

                                                            {contractInvoices.length === 0 ? (
                                                                  <p className="text-sm text-gray-400">
                                                                        No invoices yet.
                                                                  </p>
                                                            ) : (
                                                                  <div className="space-y-3">
                                                                        {contractInvoices.map((invoice) => (
                                                                              <div
                                                                                    key={invoice.id}
                                                                                    className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
                                                                              >
                                                                                    <div>
                                                                                          <p className="font-medium">
                                                                                                {formatCurrency(invoice.amount)}
                                                                                          </p>
                                                                                          <p className="text-xs text-gray-400 mt-1">
                                                                                                Issued: {formatDate(invoice.invoiceDate)} •
                                                                                                Due: {formatDate(invoice.dueDate)} • Status:{' '}
                                                                                                {invoice.status}
                                                                                          </p>
                                                                                    </div>

                                                                                    <div className="flex gap-3">
                                                                                          {invoice.status !== 'paid' && (
                                                                                                <button
                                                                                                      onClick={() =>
                                                                                                            handleMarkInvoicePaid(
                                                                                                                  invoice.id
                                                                                                            )
                                                                                                      }
                                                                                                      className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition"
                                                                                                >
                                                                                                      Mark Paid
                                                                                                </button>
                                                                                          )}

                                                                                          <button
                                                                                                onClick={() =>
                                                                                                      handleDeleteInvoice(
                                                                                                            invoice.id
                                                                                                      )
                                                                                                }
                                                                                                className="text-red-400 hover:text-red-500"
                                                                                          >
                                                                                                <Trash2 size={16} />
                                                                                          </button>
                                                                                    </div>
                                                                              </div>
                                                                        ))}
                                                                  </div>
                                                            )}
                                                      </div>
                                                )}
                                          </div>
                                    );
                              })}
                        </div>
                  )}
            </div>
      );
}
