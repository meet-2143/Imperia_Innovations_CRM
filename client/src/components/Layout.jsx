import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, UserPlus, LogOut, Search, Hexagon, HelpCircle, Wallet, TrendingUp, Settings } from 'lucide-react';
import clsx from 'clsx';

const SidebarItem = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    // Simple check for active state - can be improved for nested routes
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group mb-1",
                isActive
                    ? "bg-[#5932EA] text-white shadow-lg shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#5932EA]"
            )}
        >
            <div className="flex items-center space-x-3">
                <Icon
                    size={22}
                    className={clsx(
                        "transition-colors",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-[#5932EA]"
                    )}
                />
                <span className="font-medium text-[15px]">{label}</span>
            </div>
            {isActive && <div className="text-white opacity-0 md:opacity-100">›</div>}
        </Link>
    );
};

const Layout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-[#FAFBFF] overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white hidden md:flex flex-col z-20 shadow-[0_0_20px_rgba(0,0,0,0.03)] h-full">
                <div className="p-8 pb-8">
                    <div className="flex items-center space-x-2">
                        <Hexagon size={32} className="text-slate-900" strokeWidth={1.5} />
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Imperia <span className="text-[#5932EA]">Innovations</span></h1>
                    </div>
                </div>

                <div className="px-6 flex-1 overflow-y-auto custom-scrollbar">
                    <nav className="space-y-2">
                        <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />

                        {/* Admin Only Items (Placeholders matching reference) */}
                        {user?.role === 'admin' && (
                            <>
                                <SidebarItem to="/leads" icon={Users} label="Leads" />
                                <div className="pt-4 mt-4 border-t border-dashed border-slate-200">
                                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin</p>
                                    <SidebarItem to="/admin" icon={UserPlus} label="Team Members" />
                                </div>
                            </>
                        )}

                        {/* Salesman View */}
                        {user?.role === 'salesman' && (
                            <SidebarItem to="/leads" icon={Users} label="Leads" />
                        )}
                    </nav>


                </div>

                <div className="p-6 mt-2">
                    <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                        <div className="flex items-center space-x-3">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                alt="User"
                                className="w-10 h-10 rounded-full border border-slate-200"
                            />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <Settings size={20} className="text-slate-400 group-hover:text-[#5932EA] transition-colors" />
                    </div>
                    <button onClick={logout} className="ml-14 text-xs text-red-500 hover:text-red-600 font-medium mt-1">Sign Out</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-[#FAFBFF]">
                {/* Global Search Header (Mobile/Desktop) */}
                <div className="p-8 pb-0 max-w-7xl mx-auto flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">Hello {user?.name.split(' ')[0]} 👋,</h2>
                    <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 w-64">
                        <Search size={20} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent border-none outline-none text-sm text-slate-600 w-full placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <div className="relative p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
