import { base_url } from './Title';

// Every dashboard page an admin can switch on or off. Keys are the sidebar paths (layout/Dashboard.jsx).
export const PAGE_GROUPS = [
      {
            title: 'Main',
            pages: [
                  ['/dashboard/home', 'Dashboard'],
                  ['/dashboard/attendance', 'Attendance'],
                  ['/dashboard/issue-submit', 'Issue Submit'],
                  ['/dashboard/notice', 'Notice'],
                  ['/dashboard/your-task', 'Your Task'],
                  ['/dashboard/client_meetings', 'Client Meeting'],
                  ['/dashboard/meeting_management', 'Meeting'],
                  ['/dashboard/mail', 'Web Mail'],
                  ['/dashboard/my-payslips', 'My Payslips'],
                  ['/dashboard/sales', 'Software Sales'],
            ],
      },
      {
            title: 'Management',
            pages: [
                  ['/dashboard/blog-management', 'Blog Management'],
                  ['/dashboard/job-management', 'Job Post'],
                  ['/dashboard/project-management', 'Project Management'],
                  ['/dashboard/employee-management', 'Employee Management'],
                  ['/dashboard/attendance-management', 'Attendance Management'],
                  ['/dashboard/invoice', 'Invoice Management'],
                  ['/dashboard/contact-management', 'Contact Management'],
                  ['/dashboard/subscribers', 'Subscribers Management'],
            ],
      },
      { title: 'General', pages: [['/dashboard/account', 'Account']] },
];

export const ADMIN_DESIGNATIONS = ['Chief Executive Officer', 'manager'];

// Pages a plain employee had before access control existed; used until the server answers.
export const DEFAULT_PAGES = [
      '/dashboard/home', '/dashboard/attendance', '/dashboard/issue-submit', '/dashboard/notice', '/dashboard/your-task',
      '/dashboard/client_meetings', '/dashboard/meeting_management', '/dashboard/mail', '/dashboard/my-payslips', '/dashboard/account',
];

export const canOpen = (permissions, path) => permissions.includes('*') || permissions.includes(path);

export const accessApi = async (path, { method = 'GET', body } = {}) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${base_url}/access${path}`, {
            method,
            headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body === undefined ? undefined : JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw Object.assign(new Error(json.message || 'Request failed'), { status: res.status });
      return json.data;
};
