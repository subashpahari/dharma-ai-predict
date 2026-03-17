import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";

const OrbitAnimation: React.FC = () => {
  const { theme } = useTheme();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const currentTheme = theme === "system" ? systemTheme : theme;
      setIsLight(currentTheme === "light");
    };

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 0.8, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[#FF7F50]/10 blur-[100px] rounded-full" />

      <svg className="w-full h-auto max-w-[555px] mx-auto" viewBox="0 0 420 420">
        <style>{`
          .ecg{
            fill:none;
            stroke-width:1.5;
            opacity:0.7;
            stroke-linecap:round;
          }
          .star{
            ;
            opacity:0.88;
          }
          @keyframes rotateOrbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Group orbit circle + accent circle */}
        <g
          style={{
            transformOrigin: "210px 210px",
            animation: "rotateOrbit 20s linear infinite",
          }}
        >
          {/* Orbit circle */}
          <circle
            cx="210"
            cy="210"
            r="150"
            fill="none"
            stroke={isLight ? "black" : "#8B919A"}
            strokeWidth="0.8"
            opacity="0.44"
          />
          {/* Accent circle on the orbit */}
          <circle cx="360" cy="210" r="4" className="star" fill="#f44b35">
            <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ECG path */}
        <path
          id="ecgPath"
          className="ecg"
          d="M70 210 L120 210 L135 190 L150 240 L165 170 L185 210 L350 210"
          stroke={isLight ? "black" : "#C7CDD4"}
        />

        {/* Moving pulse along ECG path */}
        <circle r="3" className="star" fill="#35cef4">
          <animate attributeName="r" values="2;4;2" dur="0.9s" repeatCount="indefinite" />
          <animateMotion dur="11s" repeatCount="indefinite">
            <mpath href="#ecgPath" />
          </animateMotion>
        </circle>
      </svg>
    </motion.div>
  );
};

export default OrbitAnimation;