import React, { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  showBorder?: boolean;
}

const DEFAULT_COLORS = ["#40ffaa", "#4079ff", "#40ffaa"];

export default function GradientText({
  children,
  className = "",
  colors = DEFAULT_COLORS,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    backgroundSize: "200% auto",
  } as React.CSSProperties;

  const borderStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "200% auto",
  };

  return (
    <div
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center ${className}`}
    >
      {showBorder && (
        <div
          className="absolute inset-0 bg-cover z-0 pointer-events-none animate-gradient"
          style={borderStyle}
        >
          <div
            className="absolute inset-0 bg-black rounded-lg"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
      <div
        className="animate-gradient text-6xl md:text-7xl font-bold"
        style={gradientStyle}
      >
        {children}
      </div>
    </div>
  );
}
