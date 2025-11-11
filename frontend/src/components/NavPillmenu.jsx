const NavPillMenu = ({ items, handleLogout, theme }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className="relative flex items-center gap-1"
    >
      {/* Sliding animated pill */}
      <motion.div
        layout
        className="absolute inset-y-0 rounded-full bg-white/20"
        style={{
          width: hovered !== null ? "auto" : 0,
        }}
        animate={{
          x:
            hovered !== null
              ? hovered * 100 + hovered * 8
              : 0,
          opacity: hovered !== null ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
        }}
      />

      {/* Actual Buttons */}
      {items.map((item, idx) => (
        <button
          key={idx}
          onMouseEnter={() => setHovered(idx)}
          onClick={item.onClick}
          className="relative z-10 px-4 py-2 text-white font-medium rounded-full"
        >
          <div className="flex items-center gap-2">
            {item.icon}
            {item.name}
          </div>
        </button>
      ))}

      {/* Logout */}
      {items.length > 0 && (
        <button
          onMouseEnter={() => setHovered(items.length)}
          onClick={handleLogout}
          className="relative z-10 px-4 py-2 text-white font-medium rounded-full"
        >
          <div className="flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </div>
        </button>
      )}
    </div>
  );
};
