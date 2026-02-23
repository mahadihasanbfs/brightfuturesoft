import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function ProjectFormModal({
      onClose,
      onSave,
      editingProject,
}) {
      const [clientName, setClientName] = useState(
            editingProject?.clientName || ''
      );
      const [projectName, setProjectName] = useState(
            editingProject?.projectName || ''
      );
      const [description, setDescription] = useState(
            editingProject?.description || ''
      );
      const [startDate, setStartDate] = useState(
            editingProject?.startDate || ''
      );
      const [estimatedEndDate, setEstimatedEndDate] =
            useState(editingProject?.estimatedEndDate || '');
      const [totalContractValue, setTotalContractValue] =
            useState(
                  editingProject
                        ? editingProject.totalContractValue.toString()
                        : ''
            );
      const [status, setStatus] = useState(
            editingProject?.status || 'planning'
      );

      const [installments, setInstallments] = useState(
            editingProject
                  ? []
                  : [
                        {
                              id: Date.now().toString(),
                              amount: 0,
                              dueDate: '',
                              notes: '',
                        },
                  ]
      );

      /* ================= Installment Logic ================= */

      const addInstallment = () => {
            setInstallments([
                  ...installments,
                  {
                        id: Date.now().toString(),
                        amount: 0,
                        dueDate: '',
                        notes: '',
                  },
            ]);
      };

      const removeInstallment = (id) => {
            setInstallments(
                  installments.filter((i) => i.id !== id)
            );
      };

      const updateInstallment = (id, field, value) => {
            setInstallments(
                  installments.map((i) =>
                        i.id === id ? { ...i, [field]: value } : i
                  )
            );
      };

      /* ================= Save ================= */

      const handleSave = () => {
            if (
                  !clientName ||
                  !projectName ||
                  !startDate ||
                  !estimatedEndDate ||
                  !totalContractValue
            ) {
                  alert('Please fill all required fields');
                  return;
            }

            const projectId =
                  editingProject?.id || Date.now().toString();

            const newProject = {
                  id: projectId,
                  clientName,
                  projectName,
                  description,
                  startDate,
                  estimatedEndDate,
                  totalContractValue: parseFloat(
                        totalContractValue
                  ),
                  status,
                  createdAt:
                        editingProject?.createdAt ||
                        new Date().toISOString(),
            };

            const newInstallments = installments.map(
                  (inst) => ({
                        id: inst.id,
                        projectId,
                        amount: inst.amount,
                        dueDate: inst.dueDate,
                        paidDate: null,
                        status: 'pending',
                        notes: inst.notes,
                  })
            );

            onSave(newProject, newInstallments);
      };

      const totalInstallmentAmount =
            installments.reduce(
                  (sum, i) => sum + Number(i.amount),
                  0
            );

      const contractValue =
            parseFloat(totalContractValue || '0') || 0;

      /* ================= UI ================= */

      return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                  <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800">
                              <h2 className="text-lg font-semibold">
                                    {editingProject
                                          ? 'Edit Project'
                                          : 'Create New Project'}
                              </h2>
                              <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition"
                              >
                                    <X size={20} />
                              </button>
                        </div>

                        <div className="p-6 space-y-8">

                              {/* ================= Project Details ================= */}

                              <div>
                                    <h3 className="text-sm font-semibold mb-4 text-gray-300">
                                          Project Details
                                    </h3>

                                    <div className="space-y-4">

                                          <input
                                                type="text"
                                                placeholder="Client Name *"
                                                value={clientName}
                                                onChange={(e) =>
                                                      setClientName(e.target.value)
                                                }
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                          />

                                          <input
                                                type="text"
                                                placeholder="Project Name *"
                                                value={projectName}
                                                onChange={(e) =>
                                                      setProjectName(e.target.value)
                                                }
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                          />

                                          <textarea
                                                rows={3}
                                                placeholder="Project Description"
                                                value={description}
                                                onChange={(e) =>
                                                      setDescription(e.target.value)
                                                }
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                          />

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                      type="date"
                                                      value={startDate}
                                                      onChange={(e) =>
                                                            setStartDate(e.target.value)
                                                      }
                                                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                      type="date"
                                                      value={estimatedEndDate}
                                                      onChange={(e) =>
                                                            setEstimatedEndDate(
                                                                  e.target.value
                                                            )
                                                      }
                                                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                                />
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                      type="number"
                                                      placeholder="Total Contract Value *"
                                                      value={totalContractValue}
                                                      onChange={(e) =>
                                                            setTotalContractValue(
                                                                  e.target.value
                                                            )
                                                      }
                                                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                                />

                                                <select
                                                      value={status}
                                                      onChange={(e) =>
                                                            setStatus(e.target.value)
                                                      }
                                                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                                >
                                                      <option value="planning">
                                                            Planning
                                                      </option>
                                                      <option value="in-progress">
                                                            In Progress
                                                      </option>
                                                      <option value="completed">
                                                            Completed
                                                      </option>
                                                </select>
                                          </div>

                                    </div>
                              </div>

                              {/* ================= Installments ================= */}

                              <div>
                                    <div className="flex justify-between items-center mb-4">
                                          <h3 className="text-sm font-semibold text-gray-300">
                                                Payment Installments
                                          </h3>
                                          <button
                                                onClick={addInstallment}
                                                className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
                                          >
                                                <Plus size={14} />
                                                Add
                                          </button>
                                    </div>

                                    <div className="space-y-4">
                                          {installments.map(
                                                (installment, index) => (
                                                      <div
                                                            key={installment.id}
                                                            className="bg-gray-800 p-4 rounded-xl space-y-3"
                                                      >
                                                            <div className="flex justify-between items-center">
                                                                  <span className="text-sm font-medium">
                                                                        Installment {index + 1}
                                                                  </span>
                                                                  {installments.length > 1 && (
                                                                        <button
                                                                              onClick={() =>
                                                                                    removeInstallment(
                                                                                          installment.id
                                                                                    )
                                                                              }
                                                                              className="text-red-400 hover:text-red-500"
                                                                        >
                                                                              <Trash2 size={16} />
                                                                        </button>
                                                                  )}
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                  <input
                                                                        type="number"
                                                                        placeholder="Amount"
                                                                        value={installment.amount}
                                                                        onChange={(e) =>
                                                                              updateInstallment(
                                                                                    installment.id,
                                                                                    'amount',
                                                                                    parseFloat(
                                                                                          e.target.value
                                                                                    ) || 0
                                                                              )
                                                                        }
                                                                        className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                                                  />

                                                                  <input
                                                                        type="date"
                                                                        value={installment.dueDate}
                                                                        onChange={(e) =>
                                                                              updateInstallment(
                                                                                    installment.id,
                                                                                    'dueDate',
                                                                                    e.target.value
                                                                              )
                                                                        }
                                                                        className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                                                  />

                                                                  <input
                                                                        type="text"
                                                                        placeholder="Notes"
                                                                        value={installment.notes}
                                                                        onChange={(e) =>
                                                                              updateInstallment(
                                                                                    installment.id,
                                                                                    'notes',
                                                                                    e.target.value
                                                                              )
                                                                        }
                                                                        className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                                                  />
                                                            </div>
                                                      </div>
                                                )
                                          )}
                                    </div>

                                    <div className="mt-4 p-4 bg-gray-800 rounded-lg flex justify-between">
                                          <span className="text-sm text-gray-400">
                                                Total Installments
                                          </span>
                                          <span className="font-bold text-blue-400">
                                                ৳{' '}
                                                {totalInstallmentAmount.toLocaleString()}
                                          </span>
                                    </div>

                                    {contractValue > 0 &&
                                          totalInstallmentAmount !==
                                          contractValue && (
                                                <p className="text-xs text-orange-400 mt-2">
                                                      ⚠ Installments do not match
                                                      contract value. Difference:
                                                      ৳{' '}
                                                      {(
                                                            contractValue -
                                                            totalInstallmentAmount
                                                      ).toLocaleString()}
                                                </p>
                                          )}
                              </div>

                              {/* ================= Actions ================= */}

                              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                    <button
                                          onClick={onClose}
                                          className="px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 transition"
                                    >
                                          Cancel
                                    </button>
                                    <button
                                          onClick={handleSave}
                                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
                                    >
                                          {editingProject
                                                ? 'Update Project'
                                                : 'Create Project'}
                                    </button>
                              </div>

                        </div>
                  </div>
            </div>
      );
}
