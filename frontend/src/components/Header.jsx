import { useEffect, useState, useRef } from "react";
import { LogOut, User, Activity, Droplet, LayoutDashboard } from "lucide-react";

// PillTabs Component
const PillTabs = ({
  items,
  wrapperClass = "",
  textClass = "",
  pillClass = "",
  cursorClass = "",
}) => {
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const liRefs = useRef({});

  return (
    <ul
      onMouseLeave={() => setCursor((p) => ({ ...p, opacity: 0 }))}
className={`relative flex w-max rounded-full border bg-white px-2 py-1 shadow-sm transition-colors ${wrapperClass}`}
    >
      {/* Sliding role-colored cursor */}
      <li
        style={{
          left: cursor.left,
          width: cursor.width,
          opacity: cursor.opacity,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        className={`absolute z-0 rounded-full h-9 md:h-11 ${cursorClass}`}
      />

      {items.map((it) => (
        <li
          key={it.key}
          ref={(el) => (liRefs.current[it.key] = el)}
          onMouseEnter={() => {
            const el = liRefs.current[it.key];
            if (!el) return;
            const { width } = el.getBoundingClientRect();
            setCursor({ left: el.offsetLeft, width, opacity: 1 });
          }}
          onClick={() => !it.disabled && it.onClick?.()}
          className={`relative z-10 cursor-pointer select-none px-4 md:px-5 py-2 md:py-2 text-sm md:text-base font-medium flex items-center gap-2 transition-colors ${
            textClass || "text-black"
          } ${pillClass} ${it.disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          {it.icon}
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
};

// Role color themes ONLY for highlight
const THEMES = {
  pharmacy: {
    cursor: "bg-emerald-500",
  },
  user: {
    cursor: "bg-indigo-500",
  },
  hospital: {
    cursor: "bg-rose-500",
  },
  guest: {
    cursor: "bg-purple-500",
  },
};

const Header = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("role");
    setRole(stored && stored !== "null" ? stored : null);

    const onStorage = (e) => {
      if (e.key === "role") {
        setRole(e.newValue && e.newValue !== "null" ? e.newValue : null);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleLogout = async () => {
    if (!role) return;
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/${role}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {}

    localStorage.removeItem("accessToken");
    localStorage.setItem("role", "null");
    setRole(null);

    navigateTo("/");
  };

  // pick highlight color by role
  const cursorColor = THEMES[role]?.cursor || THEMES["guest"].cursor;

  const getNavItems = () => {
    if (!role) {
      return [
        {
          key: "login",
          label: "Login",
          icon: <User size={18} />,
          onClick: () => navigateTo("/"),
        },
      ];
    }

    if (role === "pharmacy") {
      return [
        {
          key: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          onClick: () => navigateTo("/pharmacy/stock"),
        },
        {
          key: "logout",
          label: "Logout",
          icon: <LogOut size={18} />,
          onClick: handleLogout,
        },
      ];
    }

    if (role === "user") {
      return [
        {
          key: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          onClick: () => navigateTo("/"),
        },
        {
          key: "blood",
          label: "Blood Donation",
          icon: <Droplet size={18} />,
          onClick: () => navigateTo("/user/bloodDonationUserPage"),
        },
        {
          key: "logout",
          label: "Logout",
          icon: <LogOut size={18} />,
          onClick: handleLogout,
        },
      ];
    }

    if (role === "hospital") {
      return [
        {
          key: "emergencies",
          label: "Emergencies",
          icon: <Activity size={18} />,
          onClick: () => navigateTo("/hospital/emergencies"),
        },
        {
          key: "blood",
          label: "Blood",
          icon: <Droplet size={18} />,
          onClick: () => navigateTo("/hospital/bloodDonationHospitalPage"),
        },
        {
          key: "logout",
          label: "Logout",
          icon: <LogOut size={18} />,
          onClick: handleLogout,
        },
      ];
    }

    return [];
  };

  const items = getNavItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between bg-teal-200 rounded-full shadow-lg border border-gray-200 px-6 py-3">
          {/* Logo */}
          <div
            onClick={() => navigateTo("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-slate-800 group-hover:scale-110 transition-all">
              <Activity className="text-white" size={24} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Lifeline</h1>

            {role && (
              <span className="ml-2 text-xs md:text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700 capitalize border border-gray-200">
                {role}
              </span>
            )}
          </div>

          {/* Pill nav right aligned */}
          <div className="flex items-center w-auto">
            <PillTabs
              items={items}
              wrapperClass="border-gray-300"
              textClass="text-black"
              cursorClass={cursorColor}
              pillClass="rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;