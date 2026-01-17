import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Users, Monitor, UserCheck, ArrowUp, ArrowDown, Target, ListChecks, CalendarCheck } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color, onClick, className = '' }) => (
    <div
        onClick={onClick}
        className={`bg-white p-6 rounded-[20px] shadow-[0_10px_60px_-10px_rgba(0,0,0,0.05)] flex items-center w-full transition-transform hover:-translate-y-1 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    >
        <div className={`w-[84px] h-[84px] rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon size={42} className={color.replace('bg-', 'text-').replace('/10', '')} />
        </div>
        <div className="ml-5">
            <p className="text-[#ACACAC] text-sm font-medium mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
            {trend && (
                <div className="flex items-center text-xs">
                    {trend === 'up' ? (
                        <span className="text-[#00AC4F] font-bold flex items-center mr-1">
                            <ArrowUp size={12} strokeWidth={4} className="mr-0.5" /> {trendValue}
                        </span>
                    ) : (
                        <span className="text-[#D0004B] font-bold flex items-center mr-1">
                            <ArrowDown size={12} strokeWidth={4} className="mr-0.5" /> {trendValue}
                        </span>
                    )}
                    <span className="text-slate-900">this month</span>
                </div>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const attendanceRef = useRef(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const endpoint = user?.role === 'admin' ? '/dashboard/stats/admin' : '/dashboard/stats/employee';
                const { data } = await api.get(endpoint);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    const scrollToAttendance = () => {
        if (attendanceRef.current) {
            attendanceRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">
                {user.role === 'admin' ? 'Overview' : 'My Performance'}
            </h2>

            {/* Admin Dashboard */}
            {user?.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        icon={Users}
                        label="Total Leads"
                        value={stats?.totalLeads || 0}
                        trend="up"
                        trendValue="16%"
                        color="bg-[#00AC4F]/10 text-[#00AC4F]"
                    />
                    <StatCard
                        icon={UserCheck}
                        label="Active Employees"
                        value={stats?.activeEmployees || 0}
                        color="bg-[#5932EA]/10 text-[#5932EA]"
                    />
                    <StatCard
                        icon={Monitor}
                        label="Attendance Today"
                        value={stats?.presentToday || 0}
                        trend="up"
                        trendValue="5%"
                        color="bg-[#5932EA]/10 text-[#5932EA]"
                        onClick={scrollToAttendance}
                    />
                </div>
            )}

            {/* Employee Dashboard */}
            {user?.role === 'salesman' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard
                        icon={ListChecks}
                        label="Assigned Leads"
                        value={stats?.assignedLeadsCount || 0}
                        color="bg-[#5932EA]/10 text-[#5932EA]"
                    />
                    <StatCard
                        icon={Target}
                        label="Target vs Achieved"
                        value={`${stats?.achieved || 0} / ${stats?.targets || 0}`}
                        color="bg-amber-500/10 text-amber-500"
                    />
                    <StatCard
                        icon={Users}
                        label="Follow-ups Due"
                        value={stats?.followUpsDue || 0}
                        color="bg-blue-500/10 text-blue-500"
                    />
                    <StatCard
                        icon={CalendarCheck}
                        label="Attendance"
                        value={stats?.attendanceStatus || 'Not Marked'}
                        color={stats?.attendanceStatus === 'Present' ? "bg-green-500/10 text-green-500" : "bg-slate-200 text-slate-500"}
                    />
                </div>
            )}

            {/* Detailed Attendance List (Admin Only) */}
            {user?.role === 'admin' && stats?.presentEmployeesList && (
                <div ref={attendanceRef} className="bg-white rounded-[30px] shadow-[0_10px_60px_-10px_rgba(0,0,0,0.05)] p-8 scroll-mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <UserCheck size={24} className="mr-3 text-[#5932EA]" />
                        Who's Present Today?
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Name</th>
                                    <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                    <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Check-in Time</th>
                                    <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.presentEmployeesList.length > 0 ? (
                                    stats.presentEmployeesList.map((emp, index) => (
                                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-slate-900">{emp.name}</td>
                                            <td className="py-4 px-2 text-slate-500 capitalize">{emp.role}</td>
                                            <td className="py-4 px-2 text-slate-900">{emp.checkInTime}</td>
                                            <td className="py-4 px-2 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                                                    Present
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-400">No employees marked present today.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Absent Employees List (Admin Only) */}
            {user?.role === 'admin' && stats?.absentEmployeesList && (
                <div className="bg-white rounded-[30px] shadow-[0_10px_60px_-10px_rgba(0,0,0,0.05)] p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <UserCheck size={24} className="mr-3 text-[#FF0404]" />
                        Who's Absent Today?
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Name</th>
                                    <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                    <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.absentEmployeesList.length > 0 ? (
                                    stats.absentEmployeesList.map((emp, index) => (
                                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-slate-900">{emp.name}</td>
                                            <td className="py-4 px-2 text-slate-500 capitalize">{emp.role}</td>
                                            <td className="py-4 px-2 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                                    Absent
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-8 text-center text-slate-400">Everyone is present today! 🎉</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Dashboard;
