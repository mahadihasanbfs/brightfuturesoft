import React from 'react';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
    { label: 'Services', description: 'What we build for clients', to: '/service' },
    { label: 'Projects', description: 'Recent work and case studies', to: '/project' },
    { label: 'Contact', description: 'Talk to our team', to: '/contacts' },
];

const GRID_TEXTURE = {
    backgroundImage:
        'linear-gradient(rgb(10 44 77 / 4%) 1px, transparent 1px), linear-gradient(90deg, rgb(10 44 77 / 4%) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
};

const NotFound = () => {
    return (
        <main
            className="flex min-h-screen items-center bg-[#F7FAFF] px-4 py-16 font-sans sm:px-6 sm:py-24 lg:px-8"
            style={GRID_TEXTURE}
        >
            <section className="mx-auto w-full max-w-3xl">
                <div className="rounded-md border border-[#E1E9F2] bg-white p-8 shadow-[0_12px_32px_rgb(10_44_77/8%)] sm:p-12">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A65B4]">
                        Error 404
                    </span>

                    <h1 className="mt-4 text-3xl font-bold leading-tight text-[#142235] sm:text-5xl">
                        This page <span className="text-[#0A65B4]">could not be found</span>
                    </h1>

                    <p className="mt-4 max-w-xl text-base leading-relaxed text-[#66758A]">
                        The link may be broken or the page may have moved. Check the address, or continue to one of the
                        sections below.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/"
                            className="inline-flex min-h-11 items-center justify-center rounded bg-[#0A65B4] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#084F8D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A65B4]/25"
                        >
                            Back to homepage
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex min-h-11 items-center justify-center rounded border border-[#E1E9F2] bg-white px-7 py-3 text-sm font-semibold text-[#142235] transition hover:border-[#0A65B4] hover:text-[#0A65B4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A65B4]/25"
                        >
                            Go back
                        </button>
                    </div>
                </div>

                <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                    {QUICK_LINKS.map(({ label, description, to }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className="block h-full rounded-md border border-[#E1E9F2] bg-white p-5 shadow-[0_6px_18px_rgb(10_44_77/5%)] transition hover:-translate-y-0.5 hover:border-[#0A65B4]/40 hover:shadow-[0_12px_28px_rgb(10_44_77/10%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A65B4]/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                            >
                                <span className="block text-sm font-semibold text-[#142235]">{label}</span>
                                <span className="mt-1 block text-sm text-[#8794A4]">{description}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
};

export default NotFound;
