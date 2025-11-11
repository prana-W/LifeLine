import { useState, useEffect } from 'react';
import { LogOut, User, Activity, Droplet, LayoutDashboard } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    });

    const handleLogout = async () => {
        if (!role || role === 'null') return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/${role}/logout`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    },
                }
            );

            if (!res.ok) {
                console.error('Logout failed on server');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.setItem('role', 'null');
            setRole(null);
            window.location.href = '/';
        }
    };

  const navigateTo = (path) => {
    window.location.href = path;
  };

    const getThemeColors = () => {
        switch (role) {
            case 'pharmacy':
                return {
                    gradient: 'from-emerald-700/50 via-emerald-800/50 to-teal-700/50',
                    border: 'border-emerald-400/30',
                    text: 'text-emerald-50',
                    hover: 'hover:bg-emerald-400/20',
                    button: 'bg-emerald-500/80 hover:bg-emerald-600/80'
                };
            case 'user':
                return {
                    gradient: 'from-blue-700/50 via-indigo-700/50 to-blue-800/50',
                    border: 'border-blue-400/30',
                    text: 'text-blue-50',
                    hover: 'hover:bg-blue-400/20',
                    button: 'bg-blue-500/80 hover:bg-blue-600/80'
                };
            case 'hospital':
                return {
                    gradient: 'from-rose-700/50 via-red-700/50 to-rose-800/50',
                    border: 'border-red-400/30',
                    text: 'text-red-50',
                    hover: 'hover:bg-red-400/20',
                    button: 'bg-red-500/80 hover:bg-red-600/80'
                };
            default:
                return {
                    gradient: 'from-purple-700/50 via-pink-700/50 to-purple-800/50',
                    border: 'border-purple-400/30',
                    text: 'text-purple-50',
                    hover: 'hover:bg-purple-400/20',
                    button: 'bg-purple-500/80 hover:bg-purple-600/80'
                };
        }
    };

    const theme = getThemeColors();

    const renderNavigation = () => {
        if (!role || role === 'null') {
            return (
                <>

                    <button
                        onClick={() => navigateTo('/analytics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                    >
                        <LayoutDashboard size={18} />
                        Analytics
                    </button>

                    <button
                        onClick={() => navigateTo('/about')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                    >
                        <LayoutDashboard size={18} />
                        About Us
                    </button>

                <button
                    onClick={() => navigateTo('/')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                >
                    <User size={18} />
                    Login
                </button>
                        </>

            );
        }

        switch (role) {
            case 'pharmacy':
                return (
                    <>
                        <button
                            onClick={() => navigateTo('/pharmacy/stock')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigateTo('/analytics')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <LayoutDashboard size={18} />
                            Analytics
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.button} text-white transition-all duration-200 font-medium ml-2`}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>

                    </>
                );
            case 'user':
                return (
                    <>
                        <button
                            onClick={() => navigateTo('/')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigateTo('/user/bloodDonationUserPage')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <Droplet size={18} />
                            Blood Donation
                        </button>
                        <button
                            onClick={() => navigateTo('/analytics')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <LayoutDashboard size={18} />
                            Analytics
                        </button>
                        <button
                            onClick={() => navigateTo('/about')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <LayoutDashboard size={18} />
                            About Us
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.button} text-white transition-all duration-200 font-medium ml-2`}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                );
            case 'hospital':
                return (
                    <>
                        <button
                            onClick={() => navigateTo('/hospital/emergencies')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <Activity size={18} />
                            Emergencies
                        </button>
                        <button
                            onClick={() => navigateTo('/hospital/bloodDonationHospitalPage')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <Droplet size={18} />
                            Blood
                        </button>
                        <button
                            onClick={() => navigateTo('/analytics')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.hover} ${theme.text} transition-all duration-200 font-medium`}
                        >
                            <LayoutDashboard size={18} />
                            Analytics
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.button} text-white transition-all duration-200 font-medium ml-2`}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
            <div
                className={`bg-gradient-to-r ${theme.gradient} border-b ${theme.border} shadow-lg backdrop-saturate-150`}
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className={`p-2 rounded-lg ${theme.button} transition-all duration-300 group-hover:scale-110`}>
                                <Activity className="text-white" size={24} />
                            </div>
                            <h1 className={`text-2xl font-bold ${theme.text} tracking-tight`}>
                                Lifeline
                            </h1>
                            {role && (
                                <span className={`text-sm px-3 py-1 rounded-full ${theme.button} text-white font-medium capitalize`}>
                                    {role}
                                </span>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <nav className="flex items-center gap-2">
                            {renderNavigation()}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
