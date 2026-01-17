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
            const { data } = await api.put(`/leads/${id}/status`, { status: newStatus });
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
            case 'In Progress': return 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]';
            case 'Closed': return 'bg-[#16C098]/10 text-[#008767] border-[#00B087]';
            case 'Lost': return 'bg-[#DF0404]/10 text-[#DF0404] border-[#DF0404]';
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

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex justify-between items-center">
                <div className="w-full flex justify-end">
                    <Link
                        to="/leads/add"
                        className="bg-[#5932EA] text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-transform active:scale-95 flex items-center"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Lead
                    </Link>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[30px] shadow-[0_10px_60px_-10px_rgba(0,0,0,0.05)] p-8">
                {/* Card Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">All Leads</h2>
                        <p className="text-[#16C098] text-sm mt-1 font-medium">Active Members</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-[#F9FBFF] rounded-xl px-4 py-2 flex items-center w-64">
                            <Search size={18} className="text-[#7E7E7E] mr-2" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-[#B5B7C0]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="bg-[#F9FBFF] rounded-xl px-3 py-2 flex items-center space-x-2 text-xs font-medium text-[#7E7E7E] cursor-pointer">
                            <span>Sort by : <span className="text-slate-900 font-bold">Newest</span></span>
                            <ChevronDown size={14} />
                        </div>
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
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Closed">Active</option>
                                                    <option value="Lost">Inactive</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-between text-xs text-[#B5B7C0]">
                    <p>Showing data 1 to {filteredLeads.length} of {leads.length} entries</p>
                    <div className="flex items-center space-x-2">
                        {/* Pagination buttons (static for now) */}
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">{'<'}</button>
                        <button className="w-6 h-6 rounded bg-[#5932EA] text-white border border-[#5932EA] flex items-center justify-center">1</button>
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">{'>'}</button>
                    </div>
                </div>
            </div>

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
