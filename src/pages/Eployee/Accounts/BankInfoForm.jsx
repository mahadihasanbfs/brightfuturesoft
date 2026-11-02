import { useEffect, useState } from "react";
import { base_url } from "../../../layout/Title";

const FIELDS = [
      ["accountHolder", "Account holder name"],
      ["bankName", "Bank name"],
      ["branch", "Branch"],
      ["accountNumber", "Account number"],
      ["routingNumber", "Routing number"],
      ["mobileBanking", "Mobile banking (bKash / Nagad / Rocket)"],
      ["mobileNumber", "Mobile banking number"],
];
const empty = Object.fromEntries(FIELDS.map(([k]) => [k, ""]));
const inputCls = "w-full rounded-xl border border-white/10 bg-gray-900/70 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 transition focus:border-blue-500/70 focus:outline-none focus:ring-4 focus:ring-blue-500/15";

const request = async (method, body) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/bank/me`, {
            method,
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || "Request failed");
      return json.data;
};

const BankInfoForm = () => {
      const [form, setForm] = useState(empty);
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [message, setMessage] = useState({ type: "", text: "" });

      useEffect(() => {
            request("GET")
                  .then((d) => setForm({ ...empty, ...d }))
                  .catch((e) => setMessage({ type: "error", text: e.message }))
                  .finally(() => setLoading(false));
      }, []);

      const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

      const onSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);
            setMessage({ type: "", text: "" });
            try {
                  setForm({ ...empty, ...(await request("PUT", form)) });
                  setMessage({ type: "success", text: "Bank info saved." });
            } catch (err) {
                  setMessage({ type: "error", text: err.message });
            } finally {
                  setSaving(false);
            }
      };

      if (loading) return <p className="text-gray-400">Loading…</p>;

      return (
            <form onSubmit={onSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Bank Info</h2>
                  <p className="text-sm text-gray-400">Used for salary payment. Only you and admins can see this.</p>
                  {message.text && (
                        <div className={`p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message.text}</div>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                        {FIELDS.map(([name, label]) => (
                              <div key={name}>
                                    <label htmlFor={name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</label>
                                    <input id={name} name={name} value={form[name]} onChange={onChange} className={inputCls} />
                              </div>
                        ))}
                  </div>
                  <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-400 hover:to-blue-500 disabled:opacity-50">
                              {saving ? "Saving..." : "Save Bank Info"}
                        </button>
                  </div>
            </form>
      );
};

export default BankInfoForm;
