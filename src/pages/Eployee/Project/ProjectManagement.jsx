import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ExternalLink, FolderOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { base_url } from '../../../layout/Title';
import { Empty, PageHeader, btnPrimary, card, confirm, input, toastError } from '../Invoice/ui';

const HEADERS = { 'content-type': 'application/json', author: 'bright_future_soft' };

const TYPES = [
      ['all', 'All'],
      ['website', 'Website'],
      ['app', 'Software'],
      ['uiDesign', 'UI/UX'],
];
const TYPE_LABEL = { website: 'Website', app: 'Software', uiDesign: 'UI/UX' };
const TYPE_STYLE = {
      website: 'bg-sky-500/15 text-sky-300',
      app: 'bg-violet-500/15 text-violet-300',
      uiDesign: 'bg-pink-500/15 text-pink-300',
};

const plain = (html = '') => new DOMParser().parseFromString(html, 'text/html').body.textContent || '';

function ProjectCard({ project, onDelete, deleting }) {
      const techs = project.technologies || [];
      return (
            <article className={`${card} group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-white/25`}>
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-800">
                        {project.image_url ? (
                              <img src={project.image_url} alt={project.project_name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        ) : (
                              <div className="flex h-full items-center justify-center text-gray-600"><FolderOpen size={36} /></div>
                        )}
                        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${TYPE_STYLE[project.projectType] || 'bg-gray-500/20 text-gray-300'}`}>
                              {TYPE_LABEL[project.projectType] || 'Project'}
                        </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                        <div>
                              <h3 className="truncate text-base font-semibold text-white">{project.project_name}</h3>
                              <p className="mt-1 line-clamp-2 text-sm text-gray-400">{plain(project.description) || 'No description.'}</p>
                        </div>
                        {techs.length > 0 && (
                              <ul className="flex flex-wrap gap-1.5">
                                    {techs.slice(0, 5).map((t) => (
                                          <li key={t.name} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1 text-xs text-gray-300">
                                                {t.imageUrl && <img src={t.imageUrl} alt="" className="h-3.5 w-3.5" />}{t.name}
                                          </li>
                                    ))}
                                    {techs.length > 5 && <li className="rounded-full bg-white/5 px-2 py-1 text-xs text-gray-400">+{techs.length - 5}</li>}
                              </ul>
                        )}
                        <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
                              <Link to={`/dashboard/project-management/edit/${project.url}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                                    <Pencil size={14} /> Edit
                              </Link>
                              <Link to={`/project/${project.url}`} target="_blank" title="View on website" className="rounded-xl border border-white/10 p-2.5 text-gray-300 transition hover:bg-white/10" aria-label="View on website">
                                    <ExternalLink size={16} />
                              </Link>
                              <button onClick={() => onDelete(project)} disabled={deleting} title="Delete" aria-label="Delete project" className="rounded-xl border border-red-500/30 p-2.5 text-red-400 transition hover:bg-red-500/15 disabled:opacity-50">
                                    <Trash2 size={16} />
                              </button>
                        </div>
                  </div>
            </article>
      );
}

const Skeleton = () => (
      <div className={`${card} animate-pulse overflow-hidden`}>
            <div className="aspect-[16/9] bg-white/5" />
            <div className="space-y-3 p-5"><div className="h-4 w-2/3 rounded bg-white/10" /><div className="h-3 w-full rounded bg-white/5" /><div className="h-3 w-1/2 rounded bg-white/5" /></div>
      </div>
);

const ProjectManagement = () => {
      const [q, setQ] = useState('');
      const [type, setType] = useState('all');

      const { data: projects = [], isPending, error, refetch } = useQuery({
            queryKey: ['project_data'],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/project/get-project`, { headers: HEADERS });
                  const json = await res.json();
                  if (!res.ok || json.success === false) throw new Error(json.message || 'Failed to load projects');
                  return Array.isArray(json.data) ? json.data : [];
            },
      });

      const remove = useMutation({
            mutationFn: async (id) => {
                  const res = await fetch(`${base_url}/project/delete-project?project_id=${id}`, { method: 'DELETE', headers: HEADERS });
                  const json = await res.json();
                  if (!json.success) throw new Error(json.message || 'Delete failed');
                  return json;
            },
            onSuccess: (json) => { Swal.fire({ icon: 'success', title: json.message, timer: 1400, showConfirmButton: false }); refetch(); },
            onError: toastError,
      });

      const onDelete = async (p) => {
            if (await confirm(`Delete "${p.project_name}"? This cannot be undone.`, 'Delete')) remove.mutate(p._id);
      };

      const shown = useMemo(() => projects.filter((p) =>
            (type === 'all' || p.projectType === type) &&
            (!q.trim() || `${p.project_name} ${(p.technologies || []).map((t) => t.name).join(' ')}`.toLowerCase().includes(q.trim().toLowerCase()))
      ), [projects, q, type]);

      return (
            <main className="w-full space-y-6 p-4 text-white sm:p-8">
                  <PageHeader
                        title="Projects"
                        subtitle={isPending ? 'Loading…' : `${projects.length} project${projects.length === 1 ? '' : 's'} on your portfolio`}
                        action={<Link to="/dashboard/project-management/new" className={btnPrimary}><Plus size={16} /> Add project</Link>}
                  />

                  <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[14rem] flex-1 sm:max-w-sm">
                              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input className={`${input} !pl-9`} placeholder="Search by name or technology…" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                              {TYPES.map(([k, label]) => (
                                    <button key={k} onClick={() => setType(k)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${type === k ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>{label}</button>
                              ))}
                        </div>
                  </div>

                  {error ? (
                        <Empty>{error.message} · <button className="text-blue-400 underline" onClick={() => refetch()}>Retry</button></Empty>
                  ) : isPending ? (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{[0, 1, 2].map((i) => <Skeleton key={i} />)}</div>
                  ) : shown.length === 0 ? (
                        <Empty>{projects.length === 0 ? 'No projects yet. Add your first one.' : 'No projects match your search.'}</Empty>
                  ) : (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                              {shown.map((p) => <ProjectCard key={p._id} project={p} onDelete={onDelete} deleting={remove.isPending} />)}
                        </div>
                  )}
            </main>
      );
};

export default ProjectManagement;
