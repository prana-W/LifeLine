import { useState, useEffect } from "react";
import {
    LogOut,
    User,
    Activity,
    Droplet,
    LayoutDashboard,
    X,
    ChevronRight,
    ChevronLeft
} from "lucide-react";

export default function SidebarWithToggle() {
    const [role, setRole] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Load role
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);

    const navigateTo = (path) => {
        window.location.href = path;
        setIsOpen(false);
    };

    const handleLogout = async () => {
        if (!role || role === "null") return;

        try {
            await fetch(
                `${import.meta.env.VITE_SERVER_URL}/${role}/logout`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "ngrok-skip-browser-warning": "true" }
                }
            );
        } catch (err) {
            console.log("Logout error");
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.setItem("role", "null");
            window.location.href = "/";
        }
    };

    /* ✅ STATIC THEME (no dynamic colors anymore) */
    const theme = {
        pill: "bg-white/10",
        text: "text-white",
        gradient: "from-black/40 via-black/40 to-black/40",
        button: "bg-teal-600 hover:bg-teal-700"
    };

    /* ✅ Side Nav Item */
    const NavItem = ({ children, onClick, icon: Icon }) => (
        <button
            onClick={onClick}
            className={`relative overflow-hidden w-full px-5 py-2 rounded-full font-medium transition-all duration-300 ${theme.text} group text-left`}
        >
            <span
                className={`absolute inset-0 rounded-full scale-x-0 origin-left ${theme.pill}
                        transition-transform duration-300 group-hover:scale-x-100`}
            ></span>

            <span className="relative z-[2] flex items-center gap-2">
                {Icon && <Icon size={18} />}
                {children}
            </span>
        </button>
    );

    return (
        <>
            {/* ✅ OPEN ARROW BUTTON */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`fixed top-8 left-6 z-40 backdrop-blur-xl border border-white/20 bg-black/40 p-3 rounded-full shadow-2xl shadow-black/20 hover:scale-110 transition-all duration-300`}
                >
                    <ChevronRight size={22} className="text-white" />
                </button>
            )}

            {/* ✅ OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ✅ SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 z-[60] backdrop-blur-xl border-r border-white/10 bg-black/40 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* ✅ HEADER WITH CLOSE ARROW */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigateTo("/")}
                    >
                        <div className={`${theme.button} p-2 rounded-full`}>
                            <Activity className="text-white" size={22} />
                        </div>

                        <h1 className={`text-xl font-semibold ${theme.text}`}>
                            Lifeline
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className={`p-2 ${theme.button} rounded-full`}
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                </div>

                {/* ✅ ROLE BADGE */}
                {role && role !== "null" && (
                    <div className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${theme.button}`}>
                            {role}
                        </span>
                    </div>
                )}

                {/* ✅ NAVIGATION ITEMS */}
                <nav className="flex flex-col gap-3 px-6 mt-4 overflow-y-auto max-h-[calc(100vh-180px)]">
                    {!role || role === "null" ? (
                        <>
                            <NavItem
                                onClick={() => navigateTo("/analytics")}
                                icon={LayoutDashboard}
                            >
                                Analytics
                            </NavItem>

                            <NavItem
                                onClick={() => navigateTo("/about")}
                                icon={LayoutDashboard}
                            >
                                About Us
                            </NavItem>

                            <NavItem
                                onClick={() => navigateTo("/")}
                                icon={User}
                            >
                                Login
                            </NavItem>
                        </>
                    ) : null}

                    {role === "pharmacy" && (
                        <>
                            <NavItem
                                onClick={() => navigateTo("/pharmacy/stock")}
                                icon={LayoutDashboard}
                            >
                                Dashboard
                            </NavItem>

                            <NavItem
                                onClick={() => navigateTo("/analytics")}
                                icon={LayoutDashboard}
                            >
                                Analytics
                            </NavItem>

                            <NavItem onClick={handleLogout} icon={LogOut}>
                                Logout
                            </NavItem>
                        </>
                    )}

                    {role === "user" && (
                        <>
                            <NavItem
                                onClick={() => navigateTo("/")}
                                icon={LayoutDashboard}
                            >
                                Dashboard
                            </NavItem>

                            <NavItem
                                onClick={() =>
                                    navigateTo("/user/bloodDonationUserPage")
                                }
                                icon={Droplet}
                            >
                                Blood
                            </NavItem>

                            <NavItem
                                onClick={() => navigateTo("/analytics")}
                                icon={LayoutDashboard}
                            >
                                Analytics
                            </NavItem>

                            <NavItem
                                onClick={() => navigateTo("/about")}
                                icon={LayoutDashboard}
                            >
                                About Us
                            </NavItem>

                            <NavItem onClick={handleLogout} icon={LogOut}>
                                Logout
                            </NavItem>
                        </>
                    )}

                    {role === "hospital" && (
                        <>
                            <NavItem
                                onClick={() =>
                                    navigateTo("/hospital/emergencies")
                                }
                                icon={Activity}
                            >
                                Emergencies
                            </NavItem>

                            <NavItem
                                onClick={() =>
                                    navigateTo(
                                        "/hospital/bloodDonationHospitalPage"
                                    )
                                }
                                icon={Droplet}
                            >
                                Blood
                            </NavItem>

                            <NavItem
                                onClick={() => navigateTo("/analytics")}
                                icon={LayoutDashboard}
                            >
                                Analytics
                            </NavItem>

                            <NavItem onClick={handleLogout} icon={LogOut}>
                                Logout
                            </NavItem>
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
}
