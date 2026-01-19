import { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import api from '../api/axios';

const LeadForm = ({ onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        contact: '',
        email: '',
        company: '',
        designation: '',
        city: '',
        state: '',
        country: 'India',
        zone: '',
        visitingCard: null
    });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(initialData?.photoUrl ? `${api.defaults.baseURL.replace('/api', '')}${initialData.photoUrl}` : null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, visitingCard: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Use FormData for file upload
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            await onSuccess(data); // Pass FormData to parent handler
            onClose();
        } catch (error) {
            console.error("Submission failed", error);
            alert(error.response?.data?.message || "Failed to save lead");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl my-8 p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {initialData ? 'Edit Lead' : 'Add New Lead'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Full Name *</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Contact Number *</label>
                            <input type="tel" name="contact" required value={formData.contact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Zone *</label>
                            <select name="zone" required value={formData.zone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]">
                                <option value="">Select Zone</option>
                                <option value="Zone A">Zone A</option>
                                <option value="Zone B">Zone B</option>
                                <option value="Zone C">Zone C</option>
                                <option value="Zone D">Zone D</option>
                            </select>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-sm font-bold text-slate-900 mb-4">Professional Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Company Name</label>
                                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Designation</label>
                                <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                            </div>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-sm font-bold text-slate-900 mb-4">Location</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Country</label>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5932EA]" />
                            </div>
                        </div>
                    </div>

                    {/* Visiting Card Upload */}
                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-sm font-bold text-slate-900 mb-4">Visiting Card</p>
                        <div className="flex items-center space-x-6">
                            <div className="flex-1">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                                        <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            {preview && (
                                <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); setFormData(prev => ({ ...prev, visitingCard: null })); }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center space-x-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 rounded-xl bg-[#5932EA] text-white font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center"
                        >
                            {loading ? 'Saving...' : <><Save size={20} className="mr-2" /> Save Lead</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadForm;
