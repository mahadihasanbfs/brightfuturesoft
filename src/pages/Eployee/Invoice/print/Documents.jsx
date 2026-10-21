import { forwardRef } from 'react';
import { BASE_CURRENCY, money, fmtDate, monthLabel } from '../format';
import signatureImage from './signature-regita.png';
import logoImage from '../../../../Assctes/logo.png';

export const COMPANY = {
      name: 'Bright Future Soft',
      tagline: 'Software Development',
      address: 'Dhaka, Bangladesh',
      phone: '+880 1792 205520',
      email: 'ac@brightfuturesoft.com',
      website: 'brightfuturesoft.com',
      // Who signs for the company at the bottom of every document.
      signatory: { name: 'Regita Redhe', title: 'HR Head and Accounts' },
};

// Applied through react-to-print so the browser prints exactly one A4 sheet per page, edge to edge.
export const A4_PAGE_STYLE = `
      @page { size: A4; margin: 8mm 0; }
      html, body { margin: 0; padding: 0; background: #fff; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
`;

const BLUE = '#0A65B4';
const INK = '#0f172a';
const MUTED = '#64748b';
const LINE = '#e2e8f0';
const SOFT = '#f1f5f9';

/* ---------- number to words ("Taka One Lakh Twenty Thousand Only") ---------- */

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const below100 = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`);
const below1000 = (n) => [n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred` : '', below100(n % 100)].filter(Boolean).join(' ');

const scaled = (n, scales) => {
      let rest = n;
      const out = [];
      for (const [size, name] of scales) {
            const part = Math.floor(rest / size);
            if (part) out.push(`${below1000(part)} ${name}`);
            rest %= size;
      }
      if (rest) out.push(below1000(rest));
      return out.join(' ');
};

const CURRENCY_NAMES = {
      BDT: ['Taka', 'Paisa'], USD: ['US Dollars', 'Cents'], EUR: ['Euros', 'Cents'], GBP: ['Pounds', 'Pence'],
      AUD: ['Australian Dollars', 'Cents'], CAD: ['Canadian Dollars', 'Cents'], SGD: ['Singapore Dollars', 'Cents'],
      AED: ['Dirhams', 'Fils'], SAR: ['Riyals', 'Halalas'], INR: ['Rupees', 'Paise'], MYR: ['Ringgit', 'Sen'], JPY: ['Yen', ''],
};

export const amountInWords = (amount, currency = BASE_CURRENCY) => {
      const value = Math.round(Number(amount || 0) * 100) / 100;
      const whole = Math.floor(value);
      const fraction = Math.round((value - whole) * 100);
      // Bangladeshi numbering (lakh, crore) for Taka; international for everything else.
      const scales = currency === BASE_CURRENCY
            ? [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand']]
            : [[1000000000, 'Billion'], [1000000, 'Million'], [1000, 'Thousand']];
      const [major, minor] = CURRENCY_NAMES[currency] || [currency, ''];
      const words = whole ? scaled(whole, scales) : 'Zero';
      const cents = fraction && minor ? ` and ${below100(fraction)} ${minor}` : '';
      return `${major} ${words}${cents} Only`;
};

/* ---------- shared pieces ---------- */

const LOGO_POINTS = [
      '393,350 1066,350 1167,527 984,763 1167,1047 1068,1212 609,1212 611,1045 948,1043 765,753 946,519 393,519',
      '393,601 809,601 700,760 393,760',
      '393,813 700,813 802,965 551,965 551,1212 393,1212',
];

// Company seal drawn as vector so it stays sharp in print: double ring, text on the ring, brand mark in the middle.
const STAMP_INK = '#2f45a0';
const Stamp = ({ size = 112 }) => (
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true" style={{ transform: 'rotate(-14deg)', opacity: 0.92 }}>
            <defs>
                  <path id="seal-top" d="M 32,100 A 68,68 0 0 1 168,100" />
                  <path id="seal-bottom" d="M 21,100 A 79,79 0 0 0 179,100" />
            </defs>
            <g fill="none" stroke={STAMP_INK}>
                  <circle cx="100" cy="100" r="96" strokeWidth="3.2" />
                  <circle cx="100" cy="100" r="89" strokeWidth="1.2" />
                  <circle cx="100" cy="100" r="58" strokeWidth="1.6" />
            </g>
            <g fill={STAMP_INK} fontFamily="Poppins, sans-serif" fontWeight="700" textAnchor="middle">
                  <text fontSize="15" letterSpacing="2.2"><textPath href="#seal-top" startOffset="50%">BRIGHT FUTURE SOFT</textPath></text>
                  <text fontSize="11.5" letterSpacing="0.6" fontWeight="600"><textPath href="#seal-bottom" startOffset="50%">www.brightfuturesoft.com</textPath></text>
                  <circle cx="30" cy="104" r="2.2" />
                  <circle cx="170" cy="104" r="2.2" />
            </g>
            <g transform="translate(100 100) scale(0.082) translate(-780 -781)" fill={STAMP_INK}>
                  {LOGO_POINTS.map((p) => <polygon key={p} points={p} />)}
            </g>
      </svg>
);

const Watermark = () => (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div style={{ opacity: 0.035, width: '70%' }}>
                  <svg viewBox="393 350 774 862" className="h-auto w-full"><g fill={BLUE}>{LOGO_POINTS.map((p) => <polygon key={p} points={p} />)}</g></svg>
            </div>
      </div>
);

// One A4 sheet: 210mm wide, at least 297mm tall on screen.
const Sheet = ({ innerRef, children }) => (
      <div
            ref={innerRef}
            className="relative mx-auto flex min-h-[297mm] w-[210mm] flex-col overflow-hidden bg-white shadow-xl print:min-h-[280mm] print:shadow-none"
            style={{ color: INK, fontSize: '9.5pt', lineHeight: 1.45, fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif" }}
      >
            <div style={{ height: '3mm', background: BLUE }} />
            <Watermark />
            <div className="relative z-10 flex flex-1 flex-col px-[14mm] pb-[8mm] pt-[7mm]">{children}</div>
      </div>
);

const Label = ({ children }) => (
      <p style={{ fontSize: '7.5pt', letterSpacing: '0.12em', color: MUTED }} className="font-semibold uppercase">{children}</p>
);

const STATUS = {
      paid: ['#047857', '#d1fae5'], partial: ['#b45309', '#fef3c7'], unpaid: ['#0369a1', '#e0f2fe'],
      overdue: ['#b91c1c', '#fee2e2'], draft: ['#475569', '#e2e8f0'], cancelled: ['#475569', '#e2e8f0'],
};

const StatusPill = ({ status }) => (
      <span
            className="inline-block rounded-full px-3 py-1 font-bold uppercase"
            style={{ fontSize: '8pt', letterSpacing: '0.14em', color: STATUS[status]?.[0], background: STATUS[status]?.[1] }}
      >
            {status}
      </span>
);

const Header = ({ title, number, status }) => (
      <div className="flex items-start justify-between">
            <img src={logoImage} alt={COMPANY.name} style={{ height: '14mm', width: 'auto' }} />
            <div className="text-right">
                  <p className="text-[24pt] font-bold leading-none tracking-[0.08em]" style={{ color: BLUE }}>{title}</p>
                  <p className="mt-1 font-semibold" style={{ fontSize: '10pt', color: INK }}>{number}</p>
                  <div className="mt-1.5"><StatusPill status={status} /></div>
            </div>
      </div>
);

const Party = ({ label, children }) => (
      <div>
            <div className="flex items-center gap-2">
                  <span style={{ width: '4mm', height: '1.2mm', background: BLUE, borderRadius: 2 }} />
                  <Label>{label}</Label>
            </div>
            <div className="mt-2">{children}</div>
      </div>
);

const Parties = ({ billLabel, bill }) => (
      <div className="mt-4 grid grid-cols-2 gap-10">
            <Party label={billLabel}>{bill}</Party>
            <Party label="From">
                  <p className="font-semibold">{COMPANY.name}</p>
                  <p style={{ color: MUTED }}>{COMPANY.address}</p>
                  <p style={{ color: MUTED }}>{COMPANY.phone}</p>
                  <p style={{ color: MUTED }}>{COMPANY.email}</p>
            </Party>
      </div>
);

// Key facts in one quiet row, separated by hairlines.
const Meta = ({ items }) => (
      <div className="mt-4 grid py-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
            {items.map(([label, value], i) => (
                  <div key={label} className="px-4" style={{ borderLeft: i ? `1px solid ${LINE}` : 'none', paddingLeft: i ? undefined : 0 }}>
                        <Label>{label}</Label>
                        <p className="mt-0.5 font-medium">{value || '-'}</p>
                  </div>
            ))}
      </div>
);

const TH = ({ children, right, width }) => (
      <th className={`px-3 py-1.5 font-semibold ${right ? 'text-right' : 'text-left'}`} style={{ width, fontSize: '8pt', letterSpacing: '0.08em' }}>{children}</th>
);

const Row = ({ label, value, strong, tone }) => (
      <div className="flex justify-between py-0.5" style={{ color: tone, fontWeight: strong ? 700 : 400 }}>
            <span>{label}</span>
            <span>{value}</span>
      </div>
);

// One signing party: who they are, then a dashed line to sign on (the company's carries the real signature).
const SignBlock = ({ lead, name, title, signature }) => (
      <div>
            <p style={{ color: MUTED }}>{lead}</p>
            <p className="font-bold" style={{ fontSize: '10.5pt' }}>{name}</p>
            <p style={{ minHeight: '1.4em' }}>{title}</p>
            <div className="relative mt-2 flex items-end" style={{ height: '12mm', borderBottom: `1.5px dashed ${MUTED}` }}>
                  <span className="pb-1">Signature:</span>
                  {signature && <img src={signatureImage} alt="" className="absolute" style={{ left: '19mm', bottom: '0.5mm', height: '11.5mm' }} />}
            </div>
      </div>
);

// Company signatory (left), company seal (centre), the other party (right): the same pattern on every document.
const Footer = ({ extra, other }) => (
      <div className="mt-auto pt-4">
            {extra}
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
                  <SignBlock lead={`For ${COMPANY.name}`} name={COMPANY.signatory.name} title={COMPANY.signatory.title} signature />
                  <Stamp size={100} />
                  <SignBlock lead={other.lead} name={other.name} title={other.title} />
            </div>
            <div className="mt-4 flex items-center justify-between pt-2.5" style={{ borderTop: `1px solid ${LINE}`, fontSize: '7.5pt', color: MUTED }}>
                  <span>{COMPANY.website} · {COMPANY.email} · {COMPANY.phone}</span>
                  <span style={{ color: BLUE, fontWeight: 600 }}>Thank you for your business</span>
            </div>
      </div>
);

/* ---------- invoice ---------- */

export const InvoiceDocument = forwardRef(function InvoiceDocument({ invoice }, ref) {
      const c = invoice.client || {};
      const cur = invoice.currency;
      const foreign = cur !== BASE_CURRENCY;

      const meta = [
            ['Issue date', fmtDate(invoice.issueDate)],
            ['Due date', fmtDate(invoice.dueDate)],
            [invoice.periodFrom ? 'Billing period' : 'Reference', invoice.periodFrom ? `${fmtDate(invoice.periodFrom)} – ${fmtDate(invoice.periodTo)}` : invoice.projectName],
      ];
      if (invoice.periodFrom && invoice.projectName) meta.push(['Reference', invoice.projectName]);

      return (
            <Sheet innerRef={ref}>
                  <Header title="INVOICE" number={invoice.number} status={invoice.status} />

                  <Parties
                        billLabel="Billed to"
                        bill={(
                              <>
                                    <p className="mt-1.5 font-bold">{c.name}</p>
                                    {c.company && <p>{c.company}</p>}
                                    {c.address && <p style={{ color: MUTED }}>{c.address}</p>}
                                    {c.email && <p style={{ color: MUTED }}>{c.email}</p>}
                                    {c.phone && <p style={{ color: MUTED }}>{c.phone}</p>}
                              </>
                        )}
                  />

                  <Meta items={meta} />

                  <table className="mt-5 w-full border-collapse">
                        <thead>
                              <tr style={{ background: BLUE, color: '#fff' }}>
                                    <TH width="8mm">#</TH>
                                    <TH>DESCRIPTION</TH>
                                    <TH right width="16mm">QTY</TH>
                                    <TH right width="32mm">RATE</TH>
                                    <TH right width="34mm">AMOUNT</TH>
                              </tr>
                        </thead>
                        <tbody>
                              {invoice.items.map((it, i) => (
                                    <tr key={i} style={{ borderBottom: `1px solid ${LINE}`, breakInside: 'avoid' }}>
                                          <td className="px-3 py-1.5" style={{ color: MUTED }}>{i + 1}</td>
                                          <td className="px-3 py-1.5 font-medium">{it.description}</td>
                                          <td className="px-3 py-1.5 text-right">{it.qty}</td>
                                          <td className="px-3 py-1.5 text-right">{money(it.rate, cur)}</td>
                                          <td className="px-3 py-1.5 text-right font-semibold">{money(it.amount, cur)}</td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>

                  <div className="mt-4 grid grid-cols-[1fr_82mm] gap-8" style={{ breakInside: 'avoid' }}>
                        <div>
                              <Label>Amount in words</Label>
                              <p className="mt-1 font-semibold italic" style={{ color: INK }}>{amountInWords(invoice.total, cur)}</p>
                              {foreign && (
                                    <p className="mt-3" style={{ fontSize: '8.5pt', color: MUTED }}>
                                          Exchange rate: 1 {cur} = {money(invoice.exchangeRate)}<br />
                                          Total in {BASE_CURRENCY}: <b style={{ color: INK }}>{money(invoice.totalBase)}</b>
                                    </p>
                              )}
                        </div>
                        <div>
                              <Row label="Subtotal" value={money(invoice.subtotal, cur)} />
                              {invoice.discount > 0 && <Row label="Discount" value={`− ${money(invoice.discount, cur)}`} />}
                              {invoice.tax > 0 && <Row label={`Tax (${invoice.taxPercent}%)`} value={money(invoice.tax, cur)} />}
                              <div style={{ borderTop: `1px solid ${LINE}` }} className="mt-1" />
                              <Row label="Total" value={money(invoice.total, cur)} strong />
                              {invoice.paid > 0 && <Row label="Paid" value={`− ${money(invoice.paid, cur)}`} tone="#047857" />}
                              <div className="mt-2 flex items-center justify-between rounded-lg px-4 py-2.5" style={{ background: invoice.balance > 0 ? BLUE : '#047857', color: '#fff' }}>
                                    <span className="font-semibold uppercase" style={{ fontSize: '8.5pt', letterSpacing: '0.1em' }}>{invoice.balance > 0 ? 'Balance due' : 'Fully paid'}</span>
                                    <span className="text-[14pt] font-bold">{money(invoice.balance, cur)}</span>
                              </div>
                        </div>
                  </div>

                  {invoice.payments.length > 0 && (
                        <div className="mt-3" style={{ breakInside: 'avoid' }}>
                              <Label>Payments received</Label>
                              <table className="mt-1.5 w-full border-collapse" style={{ fontSize: '9.5pt' }}>
                                    <tbody>
                                          {invoice.payments.map((p) => (
                                                <tr key={p._id} style={{ borderBottom: `1px solid ${LINE}` }}>
                                                      <td className="py-1.5 pr-3" style={{ width: '28mm' }}>{fmtDate(p.date)}</td>
                                                      <td className="py-1.5 pr-3 capitalize">{p.type} · {p.method}{p.note ? ` · ${p.note}` : ''}</td>
                                                      <td className="py-1.5 text-right font-semibold">{money(p.amount, cur)}</td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  )}

                  <Footer
                        other={{ lead: 'Accepted By', name: c.name, title: c.company || '' }}
                        extra={(invoice.notes || invoice.terms) && (
                              <div className="grid gap-6" style={{ gridTemplateColumns: invoice.notes && invoice.terms ? '1fr 1fr' : '1fr', breakInside: 'avoid' }}>
                                    {invoice.notes && <div><Label>Notes</Label><p className="mt-0.5" style={{ fontSize: '8.5pt', color: MUTED }}>{invoice.notes}</p></div>}
                                    {invoice.terms && <div><Label>Terms &amp; conditions</Label><p className="mt-0.5" style={{ fontSize: '8.5pt', color: MUTED }}>{invoice.terms}</p></div>}
                              </div>
                        )}
                  />
            </Sheet>
      );
});

/* ---------- payslip ---------- */

const PayTable = ({ title, rows, totalLabel, total, tone }) => (
      <div style={{ breakInside: 'avoid' }}>
            <div className="rounded-t-lg px-3 py-1.5 font-semibold uppercase" style={{ background: tone, color: '#fff', fontSize: '8pt', letterSpacing: '0.1em' }}>{title}</div>
            <div style={{ border: `1px solid ${LINE}`, borderTop: 0 }} className="rounded-b-lg">
                  {rows.length ? rows.map((r, i) => (
                        <div key={i} className="flex justify-between px-3 py-1.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                              <span className="capitalize">{r.label || r.kind}</span>
                              <span className="font-medium">{money(r.amount)}</span>
                        </div>
                  )) : <p className="px-3 py-1.5" style={{ color: MUTED }}>None</p>}
                  <div className="flex justify-between px-3 py-1.5 font-bold" style={{ background: SOFT }}>
                        <span>{totalLabel}</span>
                        <span>{money(total)}</span>
                  </div>
            </div>
      </div>
);

export const PayslipDocument = forwardRef(function PayslipDocument({ slip }, ref) {
      const e = slip.employee || {};
      const deductions = [
            ...slip.deductions,
            ...(slip.pf.enabled ? [{ label: `Provident fund (${slip.pf.employeePercent}%)`, amount: slip.pf.employee }] : []),
      ];
      const attendance = [
            slip.workingDays != null && ['Working days', slip.workingDays],
            slip.absentDays != null && ['Absent days', slip.absentDays],
            slip.extraHours != null && ['Extra hours', slip.extraHours],
      ].filter(Boolean);

      return (
            <Sheet innerRef={ref}>
                  <Header title="PAYSLIP" number={monthLabel(slip.month)} status={slip.status} />

                  <Parties
                        billLabel="Employee"
                        bill={(
                              <>
                                    <p className="mt-1.5 font-bold">{e.name}</p>
                                    <p>{e.designation}</p>
                                    <p style={{ color: MUTED }}>{e.email}</p>
                              </>
                        )}
                  />

                  <Meta items={[['Pay period', monthLabel(slip.month)], ...attendance]} />

                  <div className="mt-6 grid grid-cols-2 gap-6">
                        <PayTable title="Earnings" rows={slip.earnings} totalLabel="Gross pay" total={slip.gross} tone={BLUE} />
                        <PayTable title="Deductions" rows={deductions} totalLabel="Total deductions" total={slip.totalDeductions} tone="#475569" />
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_82mm] gap-8" style={{ breakInside: 'avoid' }}>
                        <div>
                              <Label>Net pay in words</Label>
                              <p className="mt-1 font-semibold italic">{amountInWords(slip.net)}</p>
                              {slip.pf.enabled && (
                                    <div className="mt-4 rounded-lg p-3" style={{ border: `1px solid ${LINE}`, fontSize: '9pt' }}>
                                          <Label>Provident fund this month ({slip.pf.base} {money(slip.pf.baseAmount)})</Label>
                                          <div className="mt-1 flex justify-between"><span>Employee ({slip.pf.employeePercent}%)</span><span>{money(slip.pf.employee)}</span></div>
                                          <div className="flex justify-between"><span>Company ({slip.pf.companyPercent}%)</span><span>{money(slip.pf.company)}</span></div>
                                          <div className="flex justify-between font-bold" style={{ borderTop: `1px solid ${LINE}` }}><span>Added to fund</span><span>{money(slip.pf.total)}</span></div>
                                    </div>
                              )}
                        </div>
                        <div>
                              <Row label="Gross pay" value={money(slip.gross)} />
                              <Row label="Deductions" value={`− ${money(slip.totalDeductions)}`} />
                              {slip.paid > 0 && <Row label="Paid" value={`− ${money(slip.paid)}`} tone="#047857" />}
                              <div className="mt-2 flex items-center justify-between rounded-lg px-4 py-2.5" style={{ background: BLUE, color: '#fff' }}>
                                    <span className="font-semibold uppercase" style={{ fontSize: '8.5pt', letterSpacing: '0.1em' }}>{slip.balance > 0 && slip.paid > 0 ? 'Balance' : 'Net pay'}</span>
                                    <span className="text-[14pt] font-bold">{money(slip.paid > 0 ? slip.balance : slip.net)}</span>
                              </div>
                        </div>
                  </div>

                  {slip.payments.length > 0 && (
                        <div className="mt-3" style={{ breakInside: 'avoid' }}>
                              <Label>Payments</Label>
                              <table className="mt-1.5 w-full border-collapse" style={{ fontSize: '9.5pt' }}>
                                    <tbody>
                                          {slip.payments.map((p) => (
                                                <tr key={p._id} style={{ borderBottom: `1px solid ${LINE}` }}>
                                                      <td className="py-1.5 pr-3" style={{ width: '28mm' }}>{fmtDate(p.date)}</td>
                                                      <td className="py-1.5 pr-3">{p.method}{p.note ? ` · ${p.note}` : ''}</td>
                                                      <td className="py-1.5 text-right font-semibold">{money(p.amount)}</td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  )}

                  {slip.notes && <p className="mt-6" style={{ fontSize: '9.5pt', color: MUTED }}>{slip.notes}</p>}

                  <Footer other={{ lead: 'Received By', name: e.name, title: e.designation }} />
            </Sheet>
      );
});
