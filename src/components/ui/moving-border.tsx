"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
}

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
}

const DEFAULT_DURATION = 3000;
const DEFAULT_RADIUS = "1.75rem";

export function Button({
  borderRadius = DEFAULT_RADIUS,
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = DEFAULT_DURATION,
  className,
  ...otherProps
}: ButtonProps) {
  return (
    <Component
      className={cn(
        "roundend-full relative h-16 w-40 overflow-hidden  bg-transparent p-[1px] text-xl",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="10%" ry="10%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#F6C73B_40%,transparent_60%)] opacity-[0.8]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "rounded-full relative flex h-full w-full items-center justify-center border border-slate-900 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl hover:backdrop-blur-xl hover:antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 5)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = DEFAULT_DURATION,
  rx,
  ry,
  className,
  ...otherProps
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x ?? 0
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y ?? 0
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={cn("absolute h-full w-full", className)}
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
