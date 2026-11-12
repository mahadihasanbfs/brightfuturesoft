import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { base_url } from "../../../layout/Title";
import { AuthContext } from "../../../context/UseContext/AuthProvider";
import uploadImage from "../../../Hook/ImageUpload";
import ceoSignature from "../../../Assctes/ceo-signature.png";
import { isCeo, noticeRef } from "./noticeRef";
import { confirmDialog } from "../../../Hook/confirmDialog";

const PAGE = 10;
const TABS = [["all", "All"], ["pending", "Pending approval"], ["approved", "Approved"]];

const plain = (html) => {
      const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
      return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};

const Notice_list = () => {
      const { user } = useContext(AuthContext);
      const ceo = isCeo(user);
      const canWrite = ceo || user?.designation === "manager";
      const [tab, setTab] = useState("all");
      const [search, setSearch] = useState("");
      const [shown, setShown] = useState(PAGE);
      const [showSign, setShowSign] = useState(false);

      const { data: notices = [], refetch, isLoading } = useQuery({
            queryKey: ["notice_data"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/notice/get-notice`, { headers: { "content-type": "application/json", author: "bright_future_soft" } });
                  const json = await res.json();
                  return Array.isArray(json.data) ? json.data : [];
            },
      });

      // The CEO's signature image printed on notices he approves.
      const { data: sig, refetch: refetchSig } = useQuery({
            queryKey: ["notice_signature"],
            enabled: ceo,
            queryFn: async () => (await (await fetch(`${base_url}/notice/signature`)).json())?.data?.signature || "",
      });

      const pendingCount = notices.filter((n) => n.status === "pending").length;
      const counts = { all: notices.length, pending: pendingCount, approved: notices.length - pendingCount };

      const list = useMemo(() => {
            const q = search.trim().toLowerCase();
            return notices
                  .filter((n) => (tab === "pending" ? n.status === "pending" : tab === "approved" ? n.status !== "pending" : true))
                  .filter((n) => !q || `${n.subject} ${plain(n.body)}`.toLowerCase().includes(q))
                  .sort((a, b) => new Date(b.notice_date) - new Date(a.notice_date));
      }, [notices, tab, search]);

      const approve = async (id) => {
            const res = await fetch(`${base_url}/notice/approve-notice?notice_id=${id}`, { method: "PUT", headers: { "content-type": "application/json" } });
            const json = await res.json().catch(() => ({}));
            if (json.success) { Swal.fire("Notice approved", "It is now visible to everyone.", "success"); refetch(); }
            else Swal.fire(json.message || "Could not approve", "", "info");
      };

      const remove = async (id) => {
            if (!(await confirmDialog({ title: "Delete this notice?", message: "It is removed for everyone and cannot be restored.", confirmText: "Delete", tone: "danger" }))) return;
            const res = await fetch(`${base_url}/notice/delete-notice?notice_id=${id}`, { method: "DELETE", headers: { "content-type": "application/json" } });
            const json = await res.json().catch(() => ({}));
            if (json.success) { refetch(); } else Swal.fire(json.message || "Could not delete", "", "info");
      };

      const saveSignature = async (url) => {
            const res = await fetch(`${base_url}/notice/signature`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ signature: url }) });
            const json = await res.json().catch(() => ({}));
            if (json.success) { Swal.fire(json.message, url ? "It will appear on notices you approve from now on." : "", "success"); refetchSig(); }
            else Swal.fire(json.message || "Could not save the signature", "", "info");
      };
      const pickSignature = async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            if (!file.type.startsWith("image/")) { Swal.fire("Choose an image file (PNG works best)", "", "info"); return; }
            const url = await uploadImage(file);
            if (url) saveSignature(url);
      };

      const btn = "rounded-lg border border-gray-600 bg-gray-700/60 px-3 py-1.5 text-xs font-semibold text-gray-100 transition hover:bg-gray-600";

      return (
            <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                  {/* header */}
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                              <h1 className="text-2xl font-bold tracking-tight text-white">Notices</h1>
                              <p className="mt-1 text-sm text-gray-400">Official company notices, shown on the company pad.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                              {ceo && <button onClick={() => setShowSign((v) => !v)} aria-expanded={showSign} className={btn + " py-2"}>My signature</button>}
                              {canWrite && <Link to="/dashboard/notice/new" className="rounded-lg bg-[#1c65b4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">New notice</Link>}
                        </div>
                  </div>

                  {/* CEO signature (collapsed by default) */}
                  {ceo && showSign && (
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-700 bg-gray-800 p-4">
                              <div className="max-w-xl">
                                    <p className="text-sm font-bold text-white">Your signature on notices</p>
                                    <p className="text-xs text-gray-400">{sig ? "Your uploaded signature is printed on every notice you approve." : "The signature saved with the company pad is printed on every notice you approve. Upload a photo of your signature (PNG or JPG on white paper) only to replace it."}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                    <img src={sig || ceoSignature} alt="Your signature" className="h-12 max-w-[10rem] rounded bg-white object-contain p-1" />
                                    <label className="cursor-pointer rounded-lg bg-[#1c65b4] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                                          Replace
                                          <input type="file" accept="image/*" className="sr-only" onChange={pickSignature} />
                                    </label>
                                    {sig && <button type="button" onClick={() => saveSignature("")} className="text-xs font-semibold text-gray-400 hover:text-rose-400">Use default</button>}
                              </div>
                        </div>
                  )}

                  {/* waiting for the CEO */}
                  {ceo && pendingCount > 0 && tab !== "pending" && (
                        <button onClick={() => { setTab("pending"); setShown(PAGE); }} className="mb-5 flex w-full items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-300 hover:bg-amber-500/15">
                              <span><strong>{pendingCount}</strong> notice{pendingCount === 1 ? " is" : "s are"} waiting for your approval</span>
                              <span aria-hidden="true">Review →</span>
                        </button>
                  )}

                  {/* filters */}
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                        {canWrite && <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-700 bg-gray-800 p-1">
                              {TABS.map(([key, name]) => (
                                    <button key={key} aria-pressed={tab === key} onClick={() => { setTab(key); setShown(PAGE); }} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${tab === key ? "bg-[#1c65b4] text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                                          {name}
                                          <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === key ? "bg-white/20" : "bg-gray-700 text-gray-300"}`}>{counts[key]}</span>
                                    </button>
                              ))}
                        </div>}
                        <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setShown(PAGE); }} placeholder="Search notices" aria-label="Search notices" className="min-w-[200px] flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" />
                  </div>

                  {/* list */}
                  {isLoading ? (
                        <div className="space-y-3" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl border border-gray-700 bg-gray-800" />)}</div>
                  ) : list.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/50 p-10 text-center">
                              <p className="font-semibold text-white">{search || tab !== "all" ? "No notices match" : "No notices yet"}</p>
                              <p className="mt-1 text-sm text-gray-400">{search || tab !== "all" ? "Try a different word or tab." : canWrite ? "Create the first notice with the New notice button." : "New notices will appear here."}</p>
                        </div>
                  ) : (
                        <ul className="space-y-3">
                              {list.slice(0, shown).map((n) => {
                                    const d = new Date(n.notice_date);
                                    const isPending = n.status === "pending";
                                    return (
                                          <li key={n._id} className={`flex flex-col gap-4 rounded-xl border bg-gray-800 p-4 transition sm:flex-row sm:items-center ${isPending ? "border-amber-500/40" : "border-gray-700 hover:border-gray-500"}`}>
                                                <div className="flex w-16 shrink-0 flex-row items-baseline gap-2 sm:flex-col sm:items-center sm:gap-0 sm:rounded-lg sm:border sm:border-gray-700 sm:bg-gray-900/50 sm:py-2" aria-hidden="true">
                                                      <span className="text-2xl font-bold leading-none text-white">{d.getDate()}</span>
                                                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{d.toLocaleDateString(undefined, { month: "short" })} {d.getFullYear()}</span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                      <div className="flex flex-wrap items-center gap-2">
                                                            <Link to={n._id} className="text-base font-bold text-white [overflow-wrap:anywhere] hover:text-blue-400">{n.subject}</Link>
                                                            {isPending && <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">Pending CEO approval</span>}
                                                      </div>
                                                      <p className="mt-1 line-clamp-2 text-sm text-gray-400">{plain(n.body)}</p>
                                                      <p className="mt-1.5 text-xs text-gray-500">{noticeRef(n)}</p>
                                                </div>
                                                <div className="flex shrink-0 flex-wrap items-center gap-2">
                                                      {isPending && ceo && <button onClick={() => approve(n._id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">Approve</button>}
                                                      <Link to={n._id} className={btn}>{isPending ? "Preview" : "Read"}</Link>
                                                      {canWrite && <button onClick={() => remove(n._id)} aria-label={`Delete ${n.subject}`} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-400 hover:text-rose-400">Delete</button>}
                                                </div>
                                          </li>
                                    );
                              })}
                        </ul>
                  )}

                  {list.length > shown && (
                        <div className="mt-5 text-center">
                              <button onClick={() => setShown((s) => s + PAGE)} className={btn + " px-5 py-2.5"}>Show {Math.min(PAGE, list.length - shown)} more ({list.length - shown} hidden)</button>
                        </div>
                  )}
            </div>
      );
};

export default Notice_list;
