import { useContext, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import FitSheet, { NoticeSheet } from "./NoticePad";
import { isCeo, noticeRef } from "./noticeRef";
import { A4_PAGE_STYLE } from "../Invoice/print/Documents";
import { AuthContext } from "../../../context/UseContext/AuthProvider";
import { base_url } from "../../../layout/Title";

const Notice_View = () => {
      const loaded = useLoaderData()?.data;
      const { user } = useContext(AuthContext);
      const [notice, setNotice] = useState(loaded);
      const [busy, setBusy] = useState(false);
      const sheetRef = useRef(null);
      const print = useReactToPrint({ contentRef: sheetRef, documentTitle: `Notice ${notice ? noticeRef(notice).replaceAll("/", "-") : ""}`, pageStyle: A4_PAGE_STYLE });

      if (!notice) {
            return (
                  <div className="p-8 text-gray-300">
                        <p className="font-semibold">This notice could not be found, or it is still waiting for CEO approval.</p>
                        <Link to="/dashboard/notice" className="mt-3 inline-block text-sm font-semibold text-blue-400 hover:underline">Back to notices</Link>
                  </div>
            );
      }

      const pending = notice.status === "pending";
      const approve = async () => {
            setBusy(true);
            try {
                  const res = await fetch(`${base_url}/notice/approve-notice?notice_id=${notice._id}`, { method: "PUT", headers: { "content-type": "application/json" } });
                  const json = await res.json();
                  if (json.success) { setNotice(json.data); Swal.fire("Notice approved", "It is now visible to everyone.", "success"); }
                  else Swal.fire(json.message || "Could not approve", "", "info");
            } catch {
                  Swal.fire("Could not approve. Try again.", "", "error");
            } finally {
                  setBusy(false);
            }
      };

      return (
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                              <Link to="/dashboard/notice" className="text-sm font-medium text-gray-400 hover:text-blue-400">← All notices</Link>
                              <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">Notice on company pad</h1>
                              <p className="text-sm text-gray-400">{noticeRef(notice)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                              {pending && isCeo(user) && <button onClick={approve} disabled={busy} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">{busy ? "Approving…" : "Approve this notice"}</button>}
                              <button onClick={print} disabled={pending} title={pending ? "Available after the CEO approves" : undefined} className="rounded-lg bg-[#1c65b4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">Print / Save as PDF</button>
                        </div>
                  </div>
                  {pending && (
                        <p role="status" className="mb-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
                              {isCeo(user) ? "This notice is waiting for your approval. Employees cannot see it until you approve it." : "This notice is waiting for the CEO to approve it. Only you and the CEO can see it now, and printing is available after approval."}
                        </p>
                  )}
                  <div className="rounded-2xl border border-gray-700 bg-gray-800 p-3 sm:p-6">
                        <FitSheet>
                              <NoticeSheet
                                    ref={sheetRef}
                                    subject={notice.subject}
                                    body={notice.body}
                                    date={notice.notice_date}
                                    reference={noticeRef(notice)}
                                    status={notice.status}
                                    approval={
                                          notice.approved_by
                                                ? { name: notice.approved_by.name, date: notice.approved_at, signature: notice.approved_by.signature }
                                                : pending
                                                      ? null
                                                      // Notices published before the approval step existed: shown under the CEO's name, dated by publication.
                                                      : { name: "Md. Mahadi Hasan", date: notice.notice_date }
                                    }
                              />
                        </FitSheet>
                  </div>
            </div>
      );
};

export default Notice_View;
