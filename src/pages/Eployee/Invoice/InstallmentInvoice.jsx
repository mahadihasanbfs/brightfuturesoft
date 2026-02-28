import React, { forwardRef } from "react";
import ac_image from "./ac.png";

const formatCurrency = (amount) => `৳ ${Number(amount || 0).toLocaleString()}`;
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

const InvoicePrint = forwardRef(function InvoicePrint(
      {
            project,
            installment,
            company = {
                  name: "Bright Future Soft",
                  addressLine1: "Dhaka, Bangladesh",
                  phone: "+8801792205520",
                  email: "ac@brightfuturesoft.com",
                  website: "brightfuturesoft.com",
            },
            accountManager = {
                  name: "Regita Redhe",
                  title: "Account Manager",
                  signatureSrc: ac_image,
            },
            invoiceMeta = {
                  paymentMethod: "Cash / Bank Transfer",
                  terms: "Payment due within 7 days. Please keep this invoice for your records.",
            },
            taxRate = 0,

            isModal = false,
            onClose,
      },
      ref
) {
      const invoiceNo = `INV-${installment?.id}`;
      const issueDateISO = new Date().toISOString().split("T")[0];

      const qty = 1;
      const price = Number(installment?.amount || 0);
      const subTotal = qty * price;
      const taxTotal = Math.round(subTotal * taxRate);
      const grandTotal = subTotal + taxTotal;

      const isPaid = installment?.status === "paid";

      const Paper = (
            <div
                  ref={ref}
                  className={[
                        // "paper" should remain white for printing
                        "bg-white text-slate-900 font-sans",
                        "mx-auto w-full max-w-3xl",
                        "rounded-2xl border border-slate-200 shadow-xl",
                        "overflow-hidden",
                        // print tweaks
                        "print:shadow-none print:border-slate-200 print:rounded-none",
                  ].join(" ")}
            >
                  {/* Header */}
                  <div className="relative px-8 py-7 print:px-6 print:py-5">
                        {/* subtle background accents (won't hurt printing much) */}
                        <div className="pointer-events-none absolute inset-0">
                              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-50" />
                              <div className="absolute bottom-0 -left-24 h-30 w-72 rounded-full bg-indigo-50" />
                        </div>

                        <div className="relative flex items-start justify-between gap-6">
                              <div>
                                    <div className="inline-flex items-center gap-3">
                                          <div className="h-10 w-1.5 rounded-full bg-blue-600" />
                                          <div>
                                                <h1 className="text-3xl font-extrabold tracking-tight">
                                                      Invoice
                                                </h1>
                                                <p className="mt-1 text-xs text-slate-500">
                                                      Professional billing statement
                                                </p>
                                          </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                          <p className="text-slate-500">Invoice #</p>
                                          <p className="font-semibold">{invoiceNo}</p>

                                          <p className="text-slate-500">Issue Date</p>
                                          <p className="font-semibold">{formatDate(issueDateISO)}</p>

                                          <p className="text-slate-500">Due Date</p>
                                          <p className="font-semibold">{formatDate(installment?.dueDate)}</p>
                                    </div>
                              </div>

                              <div className="text-right">
                                    <p className="text-sm font-bold">{company.name}</p>
                                    <p className="mt-1 text-xs text-slate-600">{company.addressLine1}</p>
                                    <p className="mt-1 text-xs text-slate-600">
                                          {company.phone} • {company.email}
                                    </p>
                                    {company.website ? (
                                          <p className="mt-1 text-xs text-slate-500">{company.website}</p>
                                    ) : null}

                                    <div className="mt-4 inline-flex items-center justify-end">
                                          <span
                                                className={[
                                                      "rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                                                      isPaid
                                                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                            : "bg-amber-50 text-amber-700 ring-amber-200",
                                                ].join(" ")}
                                          >
                                                {isPaid ? "PAID" : (installment?.status || "UNPAID").toUpperCase()}
                                          </span>
                                    </div>
                              </div>
                        </div>

                        {/* Bill cards */}
                        <div className="relative z-50 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                          Bill From
                                    </p>
                                    <p className="mt-2 text-sm font-semibold">{company.name}</p>
                                    <p className="mt-1 text-xs text-slate-600">{company.addressLine1}</p>
                              </div>

                              <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                          Bill To
                                    </p>
                                    <p className="mt-2 text-sm font-semibold">{project?.clientName || "-"}</p>
                                    <p className="mt-1 text-xs text-slate-600">
                                          Project:{" "}
                                          <span className="font-medium text-slate-800">
                                                {project?.projectName || "-"}
                                          </span>
                                    </p>
                                    {project?.description ? (
                                          <p className="mt-1 text-xs text-slate-500">
                                                Notes: {project.description}
                                          </p>
                                    ) : null}
                              </div>
                        </div>
                  </div>

                  {/* Details Table */}
                  <div className="border-t border-slate-200">
                        <div className="bg-slate-50 px-8 py-3 print:px-6">
                              <p className="text-sm font-semibold text-slate-700">Invoice Details</p>
                        </div>

                        <div className="px-8 print:px-6 ">
                              <table className="w-full text-sm">
                                    <thead>
                                          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                                <th className="py-3">Qty</th>
                                                <th className="py-3">Description</th>
                                                <th className="py-3 text-right">Price</th>
                                                <th className="py-3 text-right">Total</th>
                                          </tr>
                                    </thead>

                                    <tbody className="border-t border-slate-200">
                                          <tr className="align-top">
                                                <td className="py-4 text-slate-700">{qty}</td>
                                                <td className="py-4">
                                                      <p className="font-semibold text-slate-900">Installment Payment</p>
                                                      <p className="mt-1 text-xs text-slate-500">
                                                            Due: {formatDate(installment?.dueDate)} • Status:{" "}
                                                            <span className="font-medium text-slate-700">
                                                                  {installment?.status || "-"}
                                                            </span>
                                                            {installment?.paidDate ? (
                                                                  <>
                                                                        {" "}
                                                                        • Paid:{" "}
                                                                        <span className="font-medium text-slate-700">
                                                                              {formatDate(installment.paidDate)}
                                                                        </span>
                                                                  </>
                                                            ) : null}
                                                      </p>
                                                </td>
                                                <td className="py-4 text-right text-slate-700">{formatCurrency(price)}</td>
                                                <td className="py-4 text-right font-semibold text-slate-900">
                                                      {formatCurrency(subTotal)}
                                                </td>
                                          </tr>
                                    </tbody>
                              </table>
                        </div>

                        {/* Summary */}
                        <div className="border-t border-slate-200 bg-white px-8 py-5 print:px-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                          <p className="text-xs font-semibold text-slate-600">Payment Method</p>
                                          <p className="mt-2 text-sm text-slate-700">{invoiceMeta.paymentMethod}</p>

                                          <p className="mt-4 text-xs font-semibold text-slate-600">
                                                Terms &amp; Conditions
                                          </p>
                                          <p className="mt-2 text-xs text-slate-500">{invoiceMeta.terms}</p>
                                    </div>

                                    <div className="md:justify-self-end w-full max-w-sm rounded-xl bg-slate-50 p-4">
                                          <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">Sub Total</span>
                                                <span className="font-semibold text-slate-900">{formatCurrency(subTotal)}</span>
                                          </div>

                                          <div className="mt-2 flex items-center justify-between text-sm">
                                                <span className="text-slate-600">
                                                      Tax {taxRate ? `(${Math.round(taxRate * 100)}%)` : ""}
                                                </span>
                                                <span className="font-semibold text-slate-900">{formatCurrency(taxTotal)}</span>
                                          </div>

                                          <div className="my-3 h-px bg-slate-200" />

                                          <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-slate-700">Grand Total</span>
                                                <span className="text-xl font-extrabold text-slate-900">
                                                      {formatCurrency(grandTotal)}
                                                </span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Signature + footer */}
                  <div className="border-t border-slate-200 px-8 py-6 print:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                              <div className="rounded-2xl border border-slate-200 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                          Authorized Signature
                                    </p>

                                    <div className="mt-4">
                                          <img
                                                src={accountManager.signatureSrc}
                                                alt="Account manager signature"
                                                className="h-16 w-auto object-contain"
                                          />
                                    </div>

                                    <div className="mt-2">
                                          <p className="text-sm font-semibold text-slate-900">{accountManager.name}</p>
                                          <p className="text-xs text-slate-500">{accountManager.title}</p>
                                          <div className="mt-3 h-px w-full bg-slate-200" />
                                    </div>
                              </div>

                              <div className="relative overflow-hidden rounded-2xl border border-slate-200 p-5">
                                    <div className="absolute inset-x-0 -bottom-10 opacity-70">
                                          <svg viewBox="0 0 1200 120" className="h-24 w-full" preserveAspectRatio="none">
                                                <path
                                                      d="M0,64 C150,120 350,0 600,64 C850,128 1050,30 1200,64 L1200,120 L0,120 Z"
                                                      className="fill-blue-50"
                                                />
                                                <path
                                                      d="M0,82 C200,140 360,20 600,82 C840,144 1020,44 1200,82"
                                                      className="fill-none stroke-blue-200"
                                                      strokeWidth="2"
                                                />
                                          </svg>
                                    </div>

                                    <div className="relative">
                                          <p className="text-xs text-slate-500">
                                                This is a computer-generated invoice. For any query, contact{" "}
                                                <span className="font-medium text-slate-700">{company.email}</span>.
                                          </p>

                                          <div className="mt-4 text-xs text-slate-500 space-y-1">
                                                <p>
                                                      <span className="text-slate-600">Generated:</span>{" "}
                                                      <span className="font-medium">{formatDate(issueDateISO)}</span>
                                                </p>
                                                <p>
                                                      <span className="text-slate-600">Invoice #:</span>{" "}
                                                      <span className="font-medium">{invoiceNo}</span>
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        <div className="mt-6 text-center text-[11px] text-slate-500">
                              © {new Date().getFullYear()} {company.name}. All rights reserved.
                        </div>
                  </div>
            </div>
      );

      // If you want to use InvoicePrint directly as a modal, enable isModal
      if (!isModal) return Paper;

      return (
            <div className="">

                  {/* Modal layout */}
                  <div className="">
                        <div className="min-h-full px-4 py-8 flex items-center justify-center">

                              <div className="w-full max-w-4xl">



                                    {/* glass frame */}
                                    <div className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
                                          <button className="text-sm text-white/80 bg-green-500">
                                                Print Paper
                                          </button>

                                          {Paper}
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
});

export default InvoicePrint;
