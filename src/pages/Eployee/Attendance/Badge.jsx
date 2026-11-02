const STYLE = {
      present: 'bg-emerald-500/15 text-emerald-400',
      late: 'bg-amber-500/15 text-amber-400',
      leave: 'bg-sky-500/15 text-sky-400',
      absent: 'bg-red-500/15 text-red-400',
      not_in: 'bg-red-500/10 text-red-300',
      weekend: 'bg-gray-500/20 text-gray-400',
      upcoming: 'bg-gray-500/10 text-gray-500',
      pending: 'bg-amber-500/15 text-amber-400',
      approved: 'bg-emerald-500/15 text-emerald-400',
      rejected: 'bg-red-500/15 text-red-400',
};

export default function Badge({ status }) {
      return (
            <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STYLE[status] || STYLE.upcoming}`}>
                  {status === 'not_in' ? 'not in yet' : status}
            </span>
      );
}

