import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/UseContext/AuthProvider';
import { ADMIN_DESIGNATIONS } from '../../../layout/access';
import { useQuery } from '@tanstack/react-query';
import { accessApi } from '../../../layout/access';
import { MapPinPlus } from 'lucide-react';
import { PageHeader, btnPrimary } from '../Invoice/ui';
import LeadDetail from './LeadDetail';
import Monitor from './Monitor';
import Overview from './Overview';
import Pipeline from './Pipeline';
import VisitEntry from './VisitEntry';
import Visits from './Visits';

const TABS = [['overview', 'Overview'], ['pipeline', 'Leads'], ['visits', 'Visits'], ['monitor', 'Monitor']];

// Software sales: leads pipeline, field visits (photos + GPS) and visiting cards.
export default function Sales() {
      const { user } = useContext(AuthContext);
      const [tab, setTab] = useState('overview');
      const [openId, setOpenId] = useState(null);
      const [visiting, setVisiting] = useState(false);
      const { data: access } = useQuery({ queryKey: ['access-me'], queryFn: () => accessApi('/me'), staleTime: 30000 });
      const admin = ADMIN_DESIGNATIONS.includes(user?.designation) || Boolean(access?.admin);

      return (
            <main className="w-full space-y-6 p-4 text-white sm:p-8">
                  <PageHeader title="Software Sales" subtitle={admin ? 'Leads, visits and results for the whole team.' : 'Your leads, visits and follow-ups.'}
                        action={<button className={btnPrimary} onClick={() => setVisiting(true)}><MapPinPlus size={16} /> New visit</button>} />
                  <nav className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/10 p-1" role="tablist">
                        {TABS.map(([id, label]) => (
                              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === id ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>{label}</button>
                        ))}
                  </nav>
                  {tab === 'overview' && <Overview admin={admin} onOpen={setOpenId} />}
                  {tab === 'pipeline' && <Pipeline admin={admin} onOpen={setOpenId} />}
                  {tab === 'visits' && <Visits admin={admin} onOpen={setOpenId} />}
                  {tab === 'monitor' && <Monitor admin={admin} onOpen={setOpenId} />}
                  {visiting && <VisitEntry onClose={() => setVisiting(false)} />}
                  {openId && <LeadDetail id={openId} me={user?._id} admin={admin} onClose={() => setOpenId(null)} />}
            </main>
      );
}
