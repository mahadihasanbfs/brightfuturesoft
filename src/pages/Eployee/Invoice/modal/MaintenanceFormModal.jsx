'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function MaintenanceFormModal({
      onClose,
      onSave,
      editingContract,
      projects,
}) {
      const [clientName, setClientName] = useState(
            editingContract?.clientName || ''
      );

      const [contractName, setContractName] = useState(
            editingContract?.contractName || ''
      );

      const [monthlyCharge, setMonthlyCharge] = useState(
            editingContract
                  ? editingContract.monthlyCharge.toString()
                  : ''
      );

      const [billingFrequency, setBillingFrequency] =
            useState(
                  editingContract?.billingFrequency || 'monthly'
            );

      const [startDate, setStartDate] = useState(
            editingContract?.startDate || ''
      );

      const [status, setStatus] = useState(
            editingContract?.status || 'active'
      );

      const [projectId, setProjectId] = useState(
            editingContract?.projectId || ''
      );

      const handleSave = () => {
            if (
                  !clientName ||
                  !contractName ||
                  !monthlyCharge ||
                  !startDate
            ) {
                  alert('Please fill in all required fields');
                  return;
            }

            const contract = {
                  id: editingContract?.id || Date.now().toString(),
                  projectId:
                        projectId || Date.now().toString(),
                  clientName,
                  contractName,
                  monthlyCharge: parseFloat(monthlyCharge),
                  billingFrequency,
                  startDate,
                  status,
                  createdAt:
                        editingContract?.createdAt ||
                        new Date().toISOString(),
            };

            onSave(contract);
      };

      return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                  <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl">

                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800">
                              <h2 className="text-lg font-semibold">
                                    {editingContract
                                          ? 'Edit Maintenance Contract'
                                          : 'Create Maintenance Contract'}
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

                              {/* Client Name */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Client Name *
                                    </label>
                                    <input
                                          type="text"
                                          value={clientName}
                                          onChange={(e) =>
                                                setClientName(e.target.value)
                                          }
                                          placeholder="Enter client name"
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              {/* Contract Name */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Contract Name *
                                    </label>
                                    <input
                                          type="text"
                                          value={contractName}
                                          onChange={(e) =>
                                                setContractName(e.target.value)
                                          }
                                          placeholder="Software Maintenance Plan"
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              {/* Charge */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Charge Amount *
                                    </label>
                                    <input
                                          type="number"
                                          value={monthlyCharge}
                                          onChange={(e) =>
                                                setMonthlyCharge(e.target.value)
                                          }
                                          placeholder="0"
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              {/* Billing Frequency */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Billing Frequency *
                                    </label>
                                    <select
                                          value={billingFrequency}
                                          onChange={(e) =>
                                                setBillingFrequency(
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

                              {/* Start Date */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Start Date *
                                    </label>
                                    <input
                                          type="date"
                                          value={startDate}
                                          onChange={(e) =>
                                                setStartDate(e.target.value)
                                          }
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              {/* Status */}
                              <div>
                                    <label className="block text-sm mb-2 text-gray-400">
                                          Status *
                                    </label>
                                    <select
                                          value={status}
                                          onChange={(e) =>
                                                setStatus(e.target.value)
                                          }
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                          <option value="active">
                                                Active
                                          </option>
                                          <option value="inactive">
                                                Inactive
                                          </option>
                                    </select>
                              </div>

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
                                          {editingContract
                                                ? 'Update Contract'
                                                : 'Create Contract'}
                                    </button>
                              </div>

                        </div>
                  </div>
            </div>
      );
}
