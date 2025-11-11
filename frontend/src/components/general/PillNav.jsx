import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

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
      className={[
        "relative flex w-fit rounded-full border border-gray-200 bg-white p-1 shadow-sm",
        "transition-colors",
        wrapperClass,
      ].join(" ")}
    >
      {/* Sliding role-colored cursor */}
      <motion.li
        animate={cursor}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={[
          "absolute z-0 rounded-full h-9 md:h-11",
          cursorClass,
        ].join(" ")}
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
          className={[
            "relative z-10 cursor-pointer select-none",
            "px-4 md:px-5 py-2 md:py-2",
            "text-sm md:text-base",
            "font-medium",
            "flex items-center gap-2",
            "transition-colors",
            textClass || "text-black",
            pillClass,
            it.disabled ? "opacity-50 pointer-events-none" : "",
          ].join(" ")}
        >
          {it.icon}
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default PillTabs;
