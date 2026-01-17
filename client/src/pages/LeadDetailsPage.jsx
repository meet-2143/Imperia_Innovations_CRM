import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Phone, Mail, Building2, MapPin, Package, MessageSquare, History } from 'lucide-react';

const LeadDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                // In a real app we would have a specific endpoint. 
                // Currently fetching all and finding one (temporary).
                const { data } = await api.get('/leads');
                const found = data.find(l => l.id === id);
                setLead(found);
            } catch (error) {
                console.error("Failed to fetch lead");
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-400">Loading details...</div>;
    if (!lead) return <div className="p-8 text-center text-red-500">Lead not found</div>;

    // Helper to get correct field (handling backward compatibility)
    const getName = () => lead.senderName || lead.name;
    const getMobile = () => lead.senderMobile || lead.contact;
    const getEmail = () => lead.senderEmail || lead.email;
    const getCompany = () => lead.senderCompany || lead.company;
    const getProduct = () => lead.queryProductName || 'N/A';

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <button
                onClick={() => navigate('/leads')}
                className="mb-8 flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Leads
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Contact */}
                <div className="space-y-8">
                    {/* Main Profile Card */}
                    <div className="bg-white rounded-[30px] shadow-sm p-8 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#5932EA] to-purple-400 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-purple-200">
                            {getName().charAt(0)}
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 mb-1">{getName()}</h1>
                        <p className="text-slate-500 text-sm mb-6">{getCompany() || 'No Company'}</p>

                        <div className="flex justify-center space-x-3 mb-6">
                            <a href={`tel:${getMobile()}`} className="p-3 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                                <Phone size={20} />
                            </a>
                            <a href={`mailto:${getEmail()}`} className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>

                        <div className="border-t border-slate-50 pt-6 text-left space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#E6E6F2] text-slate-600`}>
                                    {lead.status}
                                </span>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Source</label>
                                <span className="text-sm font-medium text-slate-700">{lead.enqSource || 'Manual'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Zone Info */}
                    <div className="bg-white rounded-[30px] shadow-sm p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Location & Zone</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin size={18} className="mr-3 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{lead.senderCity}, {lead.senderState}</p>
                                    <p className="text-xs text-slate-400">{lead.senderAddress}</p>
                                    <p className="text-xs text-slate-400">{lead.senderCountry} - {lead.senderPincode}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-50">
                                <p className="text-xs text-slate-400">Assigned Zone</p>
                                <p className="text-lg font-bold text-[#5932EA]">{lead.zone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Requirement & Media */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Requirement Details */}
                    <div className="bg-white rounded-[30px] shadow-sm p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <Package className="mr-3 text-[#5932EA]" /> Requirement Interest
                        </h2>

                        <div className="bg-[#F9FBFF] rounded-2xl p-6 border border-slate-50 mb-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Product</p>
                                    <p className="text-lg font-bold text-slate-900">{getProduct()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Quantity</p>
                                    <p className="text-lg font-bold text-slate-900">{lead.queryQuantity || '-'} <span className="text-sm font-normal text-slate-500">{lead.queryUnit}</span></p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                                <MessageSquare size={16} className="mr-2 text-slate-400" /> Buyer Message
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-xl text-slate-600 text-sm italic border-l-4 border-slate-200">
                                "{lead.queryMessage || 'No specific message provided.'}"
                            </div>
                        </div>
                    </div>

                    {/* Visiting Card / Image */}
                    {lead.photoUrl && (
                        <div className="bg-white rounded-[30px] shadow-sm p-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Visiting Card</h2>
                            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2">
                                <img src={`http://localhost:5000${lead.photoUrl}`} alt="Visiting Card" className="w-full h-auto object-contain max-h-96 rounded-xl" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsPage;
