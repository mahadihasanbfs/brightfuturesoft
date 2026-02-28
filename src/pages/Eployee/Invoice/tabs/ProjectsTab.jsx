'use client';

import { useMemo, useRef, useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import ProjectFormModal from '../modal/ProjectFormModal';
import InvoicePrint from '../InstallmentInvoice';


export default function ProjectsTab({
      projects,
      setProjects,
      installments,
      setInstallments,
}) {
      const [showForm, setShowForm] = useState(false);
      const [expandedProject, setExpandedProject] = useState(null);
      const [editingProject, setEditingProject] = useState(null);

      // which invoice is currently selected to print
      const [selectedInvoice, setSelectedInvoice] = useState(null); // { project, installment }

      const invoiceRef = useRef(null);

      const handlePrint = useReactToPrint({
            content: () => invoiceRef.current,
            documentTitle: selectedInvoice
                  ? `Invoice-${selectedInvoice.project?.projectName}-${selectedInvoice.installment?.id}`
                  : 'Invoice',
            removeAfterPrint: true,
      });

      const formatCurrency = (amount) => `৳ ${Number(amount).toLocaleString()}`;
      const formatDate = (date) => new Date(date).toLocaleDateString();

      const getProjectProgress = (projectId) => {
            const projectInstallments = installments.filter((i) => i.projectId === projectId);

            const total = projectInstallments.reduce((sum, i) => sum + Number(i.amount), 0);

            const paid = projectInstallments
                  .filter((i) => i.status === 'paid')
                  .reduce((sum, i) => sum + Number(i.amount), 0);

            if (total === 0) return 0;
            return Math.round((paid / total) * 100);
      };

      const handleAddProject = (project, newInstallments) => {
            if (editingProject) {
                  setProjects(projects.map((p) => (p.id === project.id ? project : p)));
            } else {
                  setProjects([...projects, project]);
            }

            setInstallments([...installments, ...newInstallments]);
            setShowForm(false);
            setEditingProject(null);
      };

      const handleDeleteProject = (projectId) => {
            setProjects(projects.filter((p) => p.id !== projectId));
            setInstallments(installments.filter((i) => i.projectId !== projectId));
      };

      const handleMarkInstallmentPaid = (installmentId) => {
            setInstallments(
                  installments.map((i) =>
                        i.id === installmentId
                              ? { ...i, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
                              : i
                  )
            );
      };

      const handleInvoiceClick = (project, installment) => {
            setSelectedInvoice({ project, installment });

            // wait a tick so state updates and hidden component renders
            setTimeout(() => handlePrint(), 0);
      };

      return (
            <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6 relative">
                  {showForm && (
                        <ProjectFormModal
                              onClose={() => setShowForm(false)}
                              onSave={handleAddProject}
                              editingProject={editingProject}
                        />
                  )}

                  {/* Hidden printable invoice */}
                  <div >
                        {selectedInvoice && (
                              <div
                                    // className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl absolute top-0 left-0"
                                    onClick={(e) => e.stopPropagation()}
                                    role="dialog"
                                    aria-modal="true"
                              >
                                    <InvoicePrint
                                          ref={invoiceRef}
                                          project={selectedInvoice.project}
                                          installment={selectedInvoice.installment}
                                    />
                              </div>
                        )}
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>

                        <button
                              onClick={() => {
                                    setEditingProject(null);
                                    setShowForm(true);
                              }}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                              <Plus size={16} />
                              New Project
                        </button>
                  </div>

                  {/* Empty State */}
                  {projects.length === 0 ? (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
                              <p className="text-gray-400">No projects yet. Create your first project.</p>
                        </div>
                  ) : (
                        <div className="space-y-4">
                              {projects.map((project) => {
                                    const projectInstallments = installments.filter((i) => i.projectId === project.id);

                                    const paidAmount = projectInstallments
                                          .filter((i) => i.status === 'paid')
                                          .reduce((sum, i) => sum + Number(i.amount), 0);

                                    const progress = getProjectProgress(project.id);
                                    const isExpanded = expandedProject === project.id;

                                    return (
                                          <div
                                                key={project.id}
                                                className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden"
                                          >
                                                {/* Project Header */}
                                                <div
                                                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                                                      className="cursor-pointer p-6 hover:bg-gray-800 transition"
                                                >
                                                      <div className="flex justify-between items-start">
                                                            <div>
                                                                  <h3 className="text-lg font-semibold">{project.projectName}</h3>
                                                                  <p className="text-sm text-gray-400 mt-1">{project.clientName}</p>
                                                                  <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                                                            </div>

                                                            <div className="flex items-center gap-6">
                                                                  <div className="text-right">
                                                                        <p className="text-lg font-bold text-green-400">
                                                                              {formatCurrency(paidAmount)}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                              of {formatCurrency(project.totalContractValue)}
                                                                        </p>
                                                                  </div>

                                                                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                            </div>
                                                      </div>

                                                      {/* Progress Bar */}
                                                      <div className="mt-5 flex items-center gap-3">
                                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                                  <div
                                                                        className="h-full bg-blue-600 transition-all duration-500"
                                                                        style={{ width: `${progress}%` }}
                                                                  />
                                                            </div>
                                                            <span className="text-sm text-gray-400">{progress}%</span>
                                                      </div>
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="px-6 pb-4 flex justify-between items-center">
                                                      <div className="flex gap-3 items-center">
                                                            <span
                                                                  className={`text-xs px-3 py-1 rounded-full font-medium ${project.status === 'completed'
                                                                        ? 'bg-green-500/20 text-green-400'
                                                                        : project.status === 'in-progress'
                                                                              ? 'bg-blue-500/20 text-blue-400'
                                                                              : 'bg-gray-500/20 text-gray-400'
                                                                        }`}
                                                            >
                                                                  {project.status}
                                                            </span>

                                                            <span className="text-xs text-gray-400">
                                                                  Started: {formatDate(project.startDate)} • End:{' '}
                                                                  {formatDate(project.estimatedEndDate)}
                                                            </span>
                                                      </div>

                                                      <div className="flex gap-3">
                                                            <button
                                                                  onClick={() => {
                                                                        setEditingProject(project);
                                                                        setShowForm(true);
                                                                  }}
                                                                  className="text-sm text-blue-400 hover:text-blue-500 transition"
                                                            >
                                                                  Edit
                                                            </button>

                                                            <button
                                                                  onClick={() => handleDeleteProject(project.id)}
                                                                  className="text-red-400 hover:text-red-500 transition"
                                                            >
                                                                  <Trash2 size={16} />
                                                            </button>
                                                      </div>
                                                </div>

                                                {/* Expandable Installments */}
                                                {isExpanded && (
                                                      <div className="border-t border-gray-800 p-6 space-y-4 bg-gray-950">
                                                            <h4 className="text-sm font-semibold">
                                                                  Installments ({projectInstallments.length})
                                                            </h4>

                                                            {projectInstallments.length === 0 ? (
                                                                  <p className="text-sm text-gray-400">No installments added yet.</p>
                                                            ) : (
                                                                  <div className="space-y-3">
                                                                        {projectInstallments.map((installment) => (
                                                                              <div
                                                                                    key={installment.id}
                                                                                    className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
                                                                              >
                                                                                    <div>
                                                                                          <p className="font-medium">
                                                                                                {formatCurrency(installment.amount)}
                                                                                          </p>
                                                                                          <p className="text-xs text-gray-400 mt-1">
                                                                                                Due: {formatDate(installment.dueDate)} • Status:{' '}
                                                                                                {installment.status}
                                                                                          </p>
                                                                                    </div>

                                                                                    {installment.status !== 'paid' ? (
                                                                                          <div className="flex gap-2">
                                                                                                <button
                                                                                                      onClick={() => handleMarkInstallmentPaid(installment.id)}
                                                                                                      className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition"
                                                                                                >
                                                                                                      Mark Paid
                                                                                                </button>

                                                                                                <button
                                                                                                      onClick={() => handleInvoiceClick(project, installment)}
                                                                                                      className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition"
                                                                                                >
                                                                                                      Invoice
                                                                                                </button>
                                                                                          </div>
                                                                                    ) : (
                                                                                          <div className="flex gap-2 items-center">
                                                                                                <span className="text-xs text-green-400 font-medium">✓ Paid</span>
                                                                                                <button
                                                                                                      onClick={() => handleInvoiceClick(project, installment)}
                                                                                                      className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition"
                                                                                                >
                                                                                                      Invoice
                                                                                                </button>
                                                                                          </div>
                                                                                    )}
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
