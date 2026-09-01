import React from "react";

const HeaderNavItem = ({ content, href, active }: { content: string; href: string; active?: boolean }) => {
    return (
        <li className="list-none">
            <a
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/25"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
            >
                {content}
            </a>
        </li>
    );
};

const Header = () => {
    return (
        <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-850 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-slate-950"
                    >
                        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-1.5V9a3 3 0 0 0-3-3h-1.5V4.5a3 3 0 0 0-3-3h-1.5a3 3 0 0 0-3 3V6H6a3 3 0 0 0-3 3v1.5H1.5a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h18ZM6 9h1.5v1.5H6V9Zm6-3h1.5v1.5H12V6Zm-3 7.5h1.5V15H9v-1.5Zm6 0h1.5V15H15v-1.5Z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                        Chess<span className="text-emerald-400 font-extrabold">Node</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Interactive 3D Engine</p>
                </div>
            </div>
            <nav>
                <ul className="flex items-center gap-2 m-0 p-0">
                    <HeaderNavItem content="Play vs Engine" href="#" active={true} />
                    <HeaderNavItem content="Puzzles" href="#" />
                    <HeaderNavItem content="Leaderboard" href="#" />
                </ul>
            </nav>
        </header>
    );
};

export default Header;