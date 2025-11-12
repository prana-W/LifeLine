import { Outlet } from 'react-router-dom';
import { Header, Footer } from './components';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from "react";
import CookiePopup from "@/components/CookiePopup.jsx";
import AIChatbot from "@/components/AIChatBotComponent.jsx";

function Layout() {
    const [popUp, setPopUp] = useState("true");
    const [role, setRole] = useState(null);

    useEffect(() => {
        const isCookiePopUp = localStorage.getItem('cookie-popup');
        if (!isCookiePopUp) {
            localStorage.setItem('cookie-popup', "true");
        }
        const userRole = localStorage.getItem('role');
        setRole(userRole)
        setPopUp(isCookiePopUp);
    }, []);

    const handleClosePopup = () => {
        setPopUp("false");
    };

    return (
        <>
            <div className="min-h-screen flex flex-col relative">
                <Header />
                <main className="flex-1 flex flex-col ">
                    <Outlet />
                </main>
                <Footer />
            </div>

            {popUp === "true" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <CookiePopup onClose={handleClosePopup} />
                </div>
            )}
            {role === 'user' && <AIChatbot />}
            <Toaster />
        </>
    );
}

export default Layout;