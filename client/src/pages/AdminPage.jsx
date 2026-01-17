import { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserPlus, Search, ChevronDown, CheckCircle, XCircle } from 'lucide-react';

const AdminPage = () => {
    const [sellers, setSellers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        zone: ''
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSellers = async () => {
        try {
            const { data } = await api.get('/admin/sellers');
            setSellers(data);
        } catch (error) {
            console.error("Failed to fetch sellers");
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/sellers', formData);
            setFormData({ name: '', email: '', password: '', zone: '' });
            setShowAddModal(false);
            fetchSellers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add seller');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Top Bar / Actions */}
            <div className="flex justify-between items-center">
                <div>
                    {/* Placeholder for future top-level actions if needed */}
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#5932EA] text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-transform active:scale-95 flex items-center"
                >
                    <UserPlus size={18} className="mr-2" />
                    Add Member
                </button>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[30px] shadow-[0_10px_60px_-10px_rgba(0,0,0,0.05)] p-8">
                {/* Card Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">All Members</h2>
                        <p className="text-[#16C098] text-sm mt-1 font-medium">Active Members</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-[#F9FBFF] rounded-xl px-4 py-2 flex items-center w-64">
                            <Search size={18} className="text-[#7E7E7E] mr-2" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-[#B5B7C0]"
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
                                <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Company</th>
                                <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Phone Number</th>
                                <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Email</th>
                                <th className="text-left py-4 px-2 text-[#B5B7C0] font-medium text-sm">Zone</th>
                                <th className="text-center py-4 px-2 text-[#B5B7C0] font-medium text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((seller) => (
                                <tr key={seller.id} className="border-b border-[#EEEEEE] last:border-none hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-5 px-2 text-slate-900 font-medium text-sm">{seller.name}</td>
                                    <td className="py-5 px-2 text-slate-900 font-medium text-sm">Imperia Innovations</td>
                                    <td className="py-5 px-2 text-slate-900 font-medium text-sm">(225) 555-0118</td>
                                    <td className="py-5 px-2 text-slate-900 font-medium text-sm">{seller.email}</td>
                                    <td className="py-5 px-2 text-slate-900 font-medium text-sm">{seller.zone}</td>
                                    <td className="py-5 px-2 text-center">
                                        <div className="inline-flex items-center justify-center px-4 py-1 rounded-md border text-xs font-semibold bg-[#16C098]/10 text-[#008767] border-[#00B087]">
                                            Active
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-between text-xs text-[#B5B7C0]">
                    <p>Showing data 1 to {sellers.length} of {sellers.length} entries</p>
                    <div className="flex items-center space-x-2">
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">{'<'}</button>
                        <button className="w-6 h-6 rounded bg-[#5932EA] text-white border border-[#5932EA] flex items-center justify-center">1</button>
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">2</button>
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">3</button>
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">4</button>
                        <span className="px-1">...</span>
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">40</button>
                        <button className="w-6 h-6 rounded bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center hover:bg-[#5932EA] hover:text-white transition-colors">{'>'}</button>
                    </div>
                </div>
            </div>

            {/* Add Seller Modal (Simplified) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Add New Member</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <select
                                name="zone"
                                required
                                className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]"
                                value={formData.zone}
                                onChange={handleChange}
                            >
                                <option value="">Select Zone</option>
                                <option value="Zone A">Zone A</option>
                                <option value="Zone B">Zone B</option>
                                <option value="Zone C">Zone C</option>
                                <option value="Zone D">Zone D</option>
                            </select>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 font-medium">Cancel</button>
                                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-[#5932EA] text-white font-bold shadow-lg shadow-indigo-200">
                                    {loading ? 'Adding...' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
