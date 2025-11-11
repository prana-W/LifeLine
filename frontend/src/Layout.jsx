import { Outlet } from 'react-router-dom';
import { Header, Footer } from './components';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from "react";
import CookiePopup from "@/components/CookiePopup.jsx";

function Layout() {
    const [popUp, setPopUp] = useState("true");

    useEffect(() => {
        const isCookiePopUp = localStorage.getItem('cookie-popup');
        if (!isCookiePopUp) {
            localStorage.setItem('cookie-popup', "true");
        }
        setPopUp(isCookiePopUp);
    }, []);

    const handleClosePopup = () => {
        setPopUp("false");
    };

    return (
        <>
            <div className="min-h-screen flex flex-col relative">
                <Header />
                <main className="flex-1 flex flex-col pt-16">
                    <Outlet />
                </main>
                <Footer />
            </div>

            {/* ✅ Fullscreen overlay to perfectly center popup */}
            {popUp === "true" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <CookiePopup onClose={handleClosePopup} />
                </div>
            )}

            <Toaster />
        </>
    );
}

export default Layout;
