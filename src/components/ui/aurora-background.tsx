
"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none",
        className
      )}
      {...props}
    >
      <div
        className={cn(
            "pointer-events-none absolute -inset-[10px] opacity-40 blur-[10px] will-change-transform",
            "after:animate-aurora",
            "after:absolute after:inset-0 after:mix-blend-difference after:content-['']",
            "after:[background-attachment:fixed]",
            "[background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%]",
            "after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%]",
            "dark:[background-image:var(--dark-gradient),var(--aurora)]",
            "after:dark:[background-image:var(--dark-gradient),var(--aurora)]",
            "dark:invert-0 dark:opacity-60",
            showRadialGradient && "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
        )}
      ></div>
    </div>
  );
};
