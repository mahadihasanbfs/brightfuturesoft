const SECTIONS = [
      ['done', 'Done today', 'text-emerald-300'],
      ['progress', 'In progress', 'text-sky-300'],
      ['blockers', 'Blockers / needs help', 'text-amber-300'],
];

// A daily report in its three parts. Older reports (plain text) show as "Done today".
export default function ReportView({ parts, report }) {
      const p = parts || (report ? { done: report } : null);
      if (!p) return <p className="text-sm text-gray-500">No report.</p>;
      return (
            <div className="space-y-3">
                  {SECTIONS.filter(([k]) => p[k]).map(([k, label, tone]) => (
                        <div key={k}>
                              <p className={`text-xs font-semibold uppercase tracking-wide ${tone}`}>{label}</p>
                              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-200">{p[k]}</p>
                        </div>
                  ))}
            </div>
      );
}
