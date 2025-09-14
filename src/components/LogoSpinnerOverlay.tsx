"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";



const LogoSpinnerOverlay = ({ active }: { active: boolean }) => {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) {
      // Wait for fade-out animation before unmounting
      const timeout = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timeout);
    } else {
      setVisible(true);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-700 ${
        active ? "opacity-100" : "fade-out"
      }`}
    >
      <div className="animate-pulse-drift">
        <Logo />
      </div>
    </div>
  );
};
export default LogoSpinnerOverlay;
