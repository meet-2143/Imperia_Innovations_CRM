import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, ChevronDown, Phone, User as UserIcon, Plus } from 'lucide-react';
import LeadForm from '../components/LeadForm';
import { Link } from 'react-router-dom';

const LeadsPage = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewMode, setViewMode] = useState('kanban'); // 'list' or 'kanban'

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/leads');
            setLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { data } = await api.put(`/leads/${id}`, { status: newStatus });
            setLeads(leads.map(l => l.id === id ? data : l));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleAddLead = async (formData) => {
        const { data } = await api.post('/leads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setLeads([...leads, data]);
        fetchLeads(); // Refresh to get proper assigned names if needed, or simple append
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'New': return 'bg-[#5932EA]/10 text-[#5932EA] border-[#5932EA]';
            case 'Contacted': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Interested': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'Converted': return 'bg-green-50 text-green-600 border-green-200';
            case 'Lost': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const filteredLeads = leads.filter(lead => {
        const name = lead.senderName || lead.name || '';
        const company = lead.senderCompany || lead.company || '';
        const zone = lead.zone || '';
        const lowerSearch = searchTerm.toLowerCase();

        return name.toLowerCase().includes(lowerSearch) ||
            zone.toLowerCase().includes(lowerSearch) ||
            company.toLowerCase().includes(lowerSearch);
    });

    const statuses = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

    const KanbanColumn = ({ status, leads }) => (
        <div className="flex-1 min-w-[280px] bg-[#F9FBFF]/50 rounded-[20px] p-4 border border-slate-50">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-slate-800 flex items-center">
                    {status}
                    <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-[10px] text-slate-400 border border-slate-100 shadow-sm">
                        {leads.length}
                    </span>
                </h3>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(status) }}></div>
            </div>
            <div className="space-y-4">
                {leads.map(lead => (
                    <Link
                        key={lead.id}
                        to={`/leads/${lead.id}`}
                        className="block bg-white p-5 rounded-2xl shadow-sm border-l-4 hover:shadow-md transition-all active:scale-[0.98] group"
                        style={{ borderLeftColor: getStatusColor(status) }}
                    >
                        <h4 className="font-bold text-slate-900 group-hover:text-[#5932EA] transition-colors mb-2 text-sm">
                            {lead.senderName || lead.name}
                        </h4>
                        <div className="space-y-2">
                            <p className="text-[11px] text-slate-500 flex items-center">
                                <span className="font-semibold mr-1">Product:</span> {lead.queryProductName || 'N/A'}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center">
                                <span className="font-semibold mr-1">Company:</span> {lead.senderCompany || lead.company || '-'}
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-[#5932EA] px-2 py-0.5 bg-indigo-50 rounded-md">
                                {lead.zone}
                            </span>
                            <UserIcon size={12} className="text-slate-300" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

    function getStatusColor(status) {
        switch (status) {
            case 'New': return '#5932EA';
            case 'Contacted': return '#2563EB';
            case 'Interested': return '#9333EA';
            case 'Converted': return '#16C098';
            case 'Lost': return '#DC2626';
            default: return '#94A3B8';
        }
    }

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* View Multi-Toggle */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'kanban' ? 'bg-[#5932EA] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Kanban
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-[#5932EA] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        List
                    </button>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="bg-[#F9FBFF] rounded-xl px-4 py-2 flex items-center flex-1 md:w-64 border border-slate-100">
                        <Search size={18} className="text-[#7E7E7E] mr-2" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-[#B5B7C0]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/leads/add"
                        className="bg-[#5932EA] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center shrink-0"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Lead
                    </Link>
                </div>
            </div>

            {viewMode === 'list' ? (
                /* Main Table Card */
                <div className="bg-white rounded-[30px] shadow-[0_10px_60px_-10px_rgba(0,0,0,0.05)] p-8">
                    {/* Card Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">All Leads</h2>
                            <p className="text-[#16C098] text-sm mt-1 font-medium">Active Leads Pipeline</p>
                        </div>
                        <div className="bg-[#F9FBFF] rounded-xl px-3 py-2 flex items-center space-x-2 text-xs font-medium text-[#7E7E7E] cursor-pointer border border-slate-50">
                            <span>Sort by : <span className="text-slate-900 font-bold">Newest</span></span>
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#EEEEEE]">
                                    <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Customer Name</th>
                                    <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Product Interest</th>
                                    <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Company</th>
                                    <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Mobile</th>
                                    <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Zone</th>
                                    <th className="text-center py-4 px-2 text-[#B5B7C0] font-medium text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="py-8 text-center text-slate-400">Loading data...</td></tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr><td colSpan="6" className="py-8 text-center text-slate-400">No leads found</td></tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-[#EEEEEE] last:border-none hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-2 text-slate-900 font-medium text-sm">
                                                <Link to={`/leads/${lead.id}`} className="hover:text-[#5932EA] hover:underline">
                                                    {lead.senderName || lead.name}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-2 text-slate-900 font-medium text-sm">{lead.queryProductName || 'General'}</td>
                                            <td className="py-4 px-2 text-slate-900 font-medium text-sm">{lead.senderCompany || lead.company || '-'}</td>
                                            <td className="py-4 px-2 text-slate-900 font-medium text-sm">{lead.senderMobile || lead.contact}</td>
                                            <td className="py-4 px-2 text-slate-900 font-medium text-sm">{lead.zone}</td>
                                            <td className="py-4 px-2 text-center">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                        className={`appearance-none px-4 py-1 rounded-md border text-xs font-bold cursor-pointer bg-transparent ${getStatusStyle(lead.status)}`}
                                                        disabled={user.role !== 'admin' && lead.assignedTo !== user.id}
                                                    >
                                                        <option value="New">New</option>
                                                        <option value="Contacted">Contacted</option>
                                                        <option value="Interested">Interested</option>
                                                        <option value="Converted">Converted</option>
                                                        <option value="Lost">Lost</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            ) : (
                /* Kanban Board */
                <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
                    {statuses.map(status => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            leads={filteredLeads.filter(l => l.status === status)}
                        />
                    ))}
                </div>
            )}

            {showAddModal && (
                <LeadForm
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAddLead}
                />
            )}
        </div>
    );
};

export default LeadsPage;
