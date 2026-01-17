import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Hero / Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <LayoutDashboard size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Imperia Innovations</h1>
                    </div>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-bold mb-6 leading-tight">Empowering your business growth.</h2>
                    <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                        Manage leads, track performance, and maximize efficiency with Imperia's advanced CRM solution.
                    </p>
                    <div className="flex items-center space-x-4 text-sm font-medium text-indigo-200">
                        <div className="flex items-center">
                            <ShieldCheck size={18} className="mr-2 text-indigo-400" />
                            Secure Data
                        </div>
                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                        <div>Real-time Analytics</div>
                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                        <div>24/7 Support</div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-indigo-400/60">
                    &copy; 2024 Imperia Innovations. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl shadow-indigo-900/5 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start border border-red-100">
                            <span className="font-medium mr-1">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all font-semibold shadow-lg shadow-indigo-600/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Demo Credentials</p>
                        <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
                            <div className="bg-gray-50 p-2 rounded border border-gray-100 flex justify-between">
                                <span className="font-medium">Admin:</span>
                                <span className="font-mono">admin@crm.com / password123</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-100 flex justify-between">
                                <span className="font-medium">Sales:</span>
                                <span className="font-mono">salesA@crm.com / password123</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
