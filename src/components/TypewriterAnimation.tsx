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

const TypewriterAnimation: React.FC<TypewriterAnimationProps> = ({
  strings,
  className = "",
  delay = 75,
  deleteSpeed = 50,
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
