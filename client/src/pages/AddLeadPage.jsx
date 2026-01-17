import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload, ArrowLeft, Building2, User, MapPin, Package, MessageSquare } from 'lucide-react';

const AddLeadPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Sender Info
        senderName: '',
        senderMobile: '',
        senderEmail: '',
        senderCompany: '',

        // Address
        senderAddress: '',
        senderCity: '',
        senderState: '',
        senderCountry: 'India',
        senderPincode: '',

        // Query Info
        queryProductName: '',
        queryQuantity: '',
        queryUnit: 'Pieces',
        queryBudget: '',
        queryMessage: '',

        // System
        zone: '',
        enqSource: 'Manual'
    });

    const [visitingCard, setVisitingCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVisitingCard(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });
        if (visitingCard) {
            data.append('visitingCard', visitingCard);
        }

        try {
            await api.post('/leads', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/leads');
        } catch (error) {
            console.error("Submission failed", error);
            alert(error.response?.data?.message || "Failed to save lead");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <button
                onClick={() => navigate('/leads')}
                className="mb-8 flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Leads
            </button>

            <div className="bg-white rounded-[30px] shadow-sm p-8 md:p-12">
                <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 border-l-8 border-[#5932EA] pl-6">Add New Lead</h1>
                        <p className="text-slate-400 mt-2 ml-8">Enter lead details manually (IndiaMART standard)</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">

                    {/* Section 1: Sender Information */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <User className="mr-3 text-[#5932EA]" /> Sender Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sender Name *</label>
                                <input required type="text" name="senderName" value={formData.senderName} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile *</label>
                                <input required type="tel" name="senderMobile" value={formData.senderMobile} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                <input type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="lg:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
                                <input type="text" name="senderCompany" value={formData.senderCompany} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="lg:col-span-1 space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zone *</label>
                                <select required name="zone" value={formData.zone} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]">
                                    <option value="">Select Zone</option>
                                    <option value="Zone A">Zone A</option>
                                    <option value="Zone B">Zone B</option>
                                    <option value="Zone C">Zone C</option>
                                    <option value="Zone D">Zone D</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Address Details */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <MapPin className="mr-3 text-[#5932EA]" /> Address Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address Overview</label>
                                <input type="text" name="senderAddress" value={formData.senderAddress} onChange={handleChange} placeholder="Building, Street, Area" className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                                <input type="text" name="senderCity" value={formData.senderCity} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
                                <input type="text" name="senderState" value={formData.senderState} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pincode</label>
                                <input type="text" name="senderPincode" value={formData.senderPincode} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Requirement / Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                <Package className="mr-3 text-[#5932EA]" /> Requirement Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name *</label>
                                    <input required type="text" name="queryProductName" value={formData.queryProductName} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                                    <input type="text" name="queryQuantity" value={formData.queryQuantity} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit</label>
                                    <input type="text" name="queryUnit" value={formData.queryUnit} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA]" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specific Message</label>
                                    <textarea name="queryMessage" rows="4" value={formData.queryMessage} onChange={handleChange} className="w-full bg-[#F9FBFF] border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-[#5932EA] resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: File Upload (Visiting Card) */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                <Building2 className="mr-3 text-[#5932EA]" /> Visiting Card
                            </h3>
                            <div className="h-64 border-2 border-dashed border-[#5932EA]/30 rounded-[20px] bg-[#F9FBFF] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F5FF] transition-colors relative overflow-hidden group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-bold">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-[#5932EA]/10 rounded-full flex items-center justify-center mb-4 text-[#5932EA]">
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-slate-900 font-bold text-lg mb-1">Upload Card</p>
                                        <p className="text-slate-400 text-xs px-8 text-center">Drag & drop or click</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#5932EA] text-white px-12 py-4 rounded-xl font-bold shadow-xl shadow-[#5932EA]/20 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? 'Adding Lead...' : 'Submit Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLeadPage;
