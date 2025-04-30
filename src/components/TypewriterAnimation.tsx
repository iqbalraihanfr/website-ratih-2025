import React from "react";
import Typewriter from "typewriter-effect";

interface TypewriterAnimationProps {
  strings: string[];
  className?: string;
  delay?: number;
  deleteSpeed?: number;
  autoStart?: boolean;
  loop?: boolean;
}

const DEFAULT_DELAY = 75;
const DEFAULT_DELETE_SPEED = 50;

const TypewriterAnimation: React.FC<TypewriterAnimationProps> = ({
  strings,
  className = "",
  delay = DEFAULT_DELAY,
  deleteSpeed = DEFAULT_DELETE_SPEED,
  autoStart = true,
  loop = true,
}) => {
  return (
    <div className={className}>
      <Typewriter
        options={{
          strings,
          autoStart,
          loop,
          delay,
          deleteSpeed,
          cursor: "|",
          cursorClassName: "text-amber-300",
          wrapperClassName: "text-white font-medium",
        }}
      />
    </div>
  );
};

export default TypewriterAnimation;
