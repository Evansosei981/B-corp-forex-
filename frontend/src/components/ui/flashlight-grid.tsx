import { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export function FlashlightGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Use a spring to make the spotlight lag slightly for a smooth, liquid feel
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden bg-background group"
      onMouseMove={handleMouseMove}
    >
      {/* Base Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      
      {/* Spotlight that illuminates the grid */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${springX}px ${springY}px,
              rgba(252, 213, 53, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Grid overlay specifically illuminated by the spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(to right, #FCD53515 1px, transparent 1px), linear-gradient(to bottom, #FCD53515 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              300px circle at ${springX}px ${springY}px,
              black,
              transparent 80%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              300px circle at ${springX}px ${springY}px,
              black,
              transparent 80%
            )
          `,
        }}
      />
    </div>
  );
}
